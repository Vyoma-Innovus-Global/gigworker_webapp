"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
    CheckCircle2,
    AlertCircle,
    Loader2,
    BadgeCheck,
    AlertTriangle,
    ArrowRight,
    LoaderCircle,
    ArrowLeft,
} from "lucide-react";
import Cookies from "react-cookies";
import {
    uploadSendOtp,
    uploadVerifyOtp,
    generateCertificateByApplicationID,
    updateApplicationApprovalStatusAPI,
} from "./api"; // Adjust path as needed
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import BackgroundImg from "@/assets/bg_img_1.jpg";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { createSHA256Hash } from "@/utils/crypto";
import { useRouter } from "next/navigation";

const SubmitApplicationPage = () => {
    const { toast } = useToast();
    const router = useRouter();
    const [applicationNo, setApplicationNo] = useState(null);
    const [AADHAAR, setAADHAAR] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [transactionId, setTransactionId] = useState("");
    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [loadingGenerateUDIN, setLoadingGenerateUDIN] = useState(false);
    const [finalSubmitSuccess, setFinalSubmitSuccess] = useState(false);
    const [certificateGenerated, setCertificateGenerated] = useState(false);
    const [applicationID, setApplicationID] = useState("");
    const [AADHAARError, setAADHAARError] = useState("");
    const [validAADHAARMsg, setValidAADHAARMsg] = useState("");
    const [resendTimer, setResendTimer] = useState(60);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const application_no = Cookies.load("ano") || "-";
        const aid = Cookies.load("aid");
        setApplicationNo(application_no);
        setApplicationID(aid);
    }, []);

    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (otpSent && resendTimer > 0) {
            const timer = setInterval(() => {
                setResendTimer(resendTimer - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [otpSent, resendTimer]);

    // Copy all your existing functions: sendOtp, verifyOtp, handleFinalSubmit, 
    // generateUDINCertificate, handleAadharChange here...

    const sendOtp = async () => {
        const aadhaarNumber = AADHAAR.split("-").join("");
        const user_aadhaar_hash = Cookies.load("hash");
        const current_input_hash = createSHA256Hash(aadhaarNumber);

        if (user_aadhaar_hash !== current_input_hash) {
            toast({
                variant: "destructive",
                title: (
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        <span>AADHAAR Mismatch</span>
                    </div>
                ),
                description: "Your AADHAAR number does not match with the one used during registration.",
            });
            return;
        }

        if (aadhaarNumber.length !== 12 || !/^\d{12}$/.test(aadhaarNumber)) {
            toast({
                variant: "destructive",
                title: (
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        <span>Invalid AADHAAR Number</span>
                    </div>
                ),
                description: "Please enter a valid 12-digit numeric AADHAAR number.",
            });
            return;
        }

        setLoading(true);
        try {
            const data = await uploadSendOtp(aadhaarNumber);
            if (data?.status === 0) {
                setOtpSent(true);
                setTransactionId(data?.data?.transaction_id);
                toast({
                    title: (
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span>OTP Sent!</span>
                        </div>
                    ),
                    description: "An OTP has been sent to your AADHAAR-linked phone.",
                });
                setTimeout(() => {
                    setLoading(false);
                    setResendTimer(60);
                }, 2000);
            } else {
                throw new Error(data.message || "Failed to send OTP.");
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: (
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        <span>OTP Sending Failed</span>
                    </div>
                ),
                description: error.message || "An unexpected error occurred while sending OTP.",
            });
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
            toast({
                variant: "destructive",
                title: (
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        <span>Invalid OTP</span>
                    </div>
                ),
                description: "Please enter a valid 6-digit OTP.",
            });
            return;
        }

        setOtpLoading(true);
        try {
            const data = await uploadVerifyOtp(otp, transactionId);
            if (data.status === 0) {
                setOtpVerified(true);
                if (data?.data?.photo_base64) {
                    localStorage.setItem("aadhaar_photo", data.data.photo_base64);
                }
                toast({
                    title: (
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span>OTP Verified!</span>
                        </div>
                    ),
                    description: "Your OTP has been successfully verified.",
                });
            } else {
                throw new Error(data.message || "Failed to verify OTP.");
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: (
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        <span>OTP Verification Failed</span>
                    </div>
                ),
                description: error.message,
            });
        } finally {
            setOtpLoading(false);
        }
    };

    const handleFinalSubmit = async () => {
        try {
            const response = await updateApplicationApprovalStatusAPI();
            if (response?.status == 0) {
                setFinalSubmitSuccess(true);
            } else {
                throw new Error(response.message || "Failed to Submit.");
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: (
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        <span>Submit Failed</span>
                    </div>
                ),
                description: error.message,
            });
        }
    };

    const generateUDINCertificate = async () => {
        setLoadingGenerateUDIN(true);
        try {
            await generateCertificateByApplicationID();
            setCertificateGenerated(true);
            await handleFinalSubmit();
            toast({
                title: (
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span>Certificate Generated!</span>
                    </div>
                ),
                description: "Your registration card has been generated successfully.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: (
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        <span>Registration Card Generation Failed</span>
                    </div>
                ),
                description: error.message,
            });
        } finally {
            setLoadingGenerateUDIN(false);
        }
    };

    const handleAadharChange = (input) => {
        let numericInput = input.replace(/\D/g, "");
        let formattedAADHAAR = numericInput
            .slice(0, 12)
            .replace(/(\d{4})(\d{4})?(\d{4})?/, (match, p1, p2, p3) =>
                [p1, p2, p3].filter(Boolean).join("-")
            );

        setAADHAAR(formattedAADHAAR);
        if (formattedAADHAAR.split("-").join("").length != 12) {
            setAADHAARError("Please enter 12-digit valid AADHAAR number");
            setValidAADHAARMsg("");
        } else {
            setAADHAARError("");
            setValidAADHAARMsg("Valid AADHAAR Number");
        }
    };

    return (
        <div className="w-full flex justify-center px-4 py-6 bg-transparent relative min-h-screen">
            <Image
                src={BackgroundImg}
                alt="Background Image"
                objectFit="cover"
                className="absolute opacity-10 inset-0 mt-[3rem] -z-2"
            />

            <div className="px-6 py-2 justify-center flex-col flex w-full z-1 relative max-w-6xl">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-4 w-fit flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Preview
                </Button>

                {/* Content from dialog */}
                <Card className="w-full mx-auto shadow-lg">
                    <div className="bg-gradient-to-r from-violet-600 to-amber-600 px-6 py-4 rounded-t-xl">
                        <h1 className="text-3xl font-bold text-white text-center">
                            Submit the Application for ID Card Generation
                        </h1>
                    </div>

                    <CardContent className="flex flex-col justify-center p-6">
                        <span className="text-xl text-center text-muted-foreground mb-6">
                            Registration Number: <b className="text-violet-600">{applicationNo !== null ? applicationNo : "-"}</b>
                        </span>

                        <div className="min-h-[50vh] w-full rounded-md flex flex-col items-center gap-4">
                            {!otpVerified && !otpSent ? (
                                <>
                                    <div className="flex w-full max-w-md">
                                        <Input
                                            type="text"
                                            placeholder="Enter AADHAAR Number (XXXX-XXXX-1234)"
                                            value={AADHAAR}
                                            onChange={(e) => handleAadharChange(e.target.value)}
                                            className={`flex-1 rounded-e-none ${AADHAARError
                                                ? "border-red-400 border-2"
                                                : validAADHAARMsg
                                                    ? "border-green-400 border-2"
                                                    : "border"
                                                }`}
                                        />
                                        <Button
                                            onClick={sendOtp}
                                            disabled={loading}
                                            className="bg-blue-500 rounded-s-none hover:bg-blue-600 text-white w-40"
                                        >
                                            {loading ? (
                                                <div className="flex items-center gap-1">
                                                    <Loader2 className="animate-spin" />
                                                    Sending...
                                                </div>
                                            ) : (
                                                "Send OTP"
                                            )}
                                        </Button>
                                    </div>
                                    {AADHAARError && (
                                        <span className="text-red-500 flex items-center gap-1">
                                            <AlertTriangle size={18} />
                                            {AADHAARError}
                                        </span>
                                    )}
                                    {validAADHAARMsg && (
                                        <span className="text-green-600 flex items-center gap-1">
                                            <CheckCircle2 size={18} />
                                            {validAADHAARMsg}
                                        </span>
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-4 w-full max-w-md">
                                    {otpSent && !otpVerified && (
                                        <>
                                            <div className="flex w-full">
                                                <Input
                                                    type="text"
                                                    placeholder="Enter OTP"
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    maxLength={6}
                                                    className="flex-1 text-center rounded-e-none"
                                                />
                                                <Button
                                                    onClick={verifyOtp}
                                                    disabled={otpLoading}
                                                    className="bg-green-500 hover:bg-green-700 rounded-s-none text-white w-40"
                                                >
                                                    {otpLoading ? (
                                                        <div className="flex items-center gap-1">
                                                            <Loader2 className="animate-spin" />
                                                            Verifying...
                                                        </div>
                                                    ) : (
                                                        "Verify OTP"
                                                    )}
                                                </Button>
                                            </div>

                                            <p className="whitespace-pre-wrap text-center text-sm">
                                                {hydrated &&
                                                    (resendTimer !== 0 ? (
                                                        `Didn't receive the OTP? \nYou can resend after ${resendTimer} seconds.`
                                                    ) : (
                                                        <>
                                                            Didn't receive the OTP?
                                                            <Button
                                                                variant="link"
                                                                onClick={sendOtp}
                                                                className="text-blue-500 font-bold px-1"
                                                                disabled={loading}
                                                            >
                                                                {loading ? (
                                                                    <>
                                                                        Please wait... <LoaderCircle className="animate-spin" />
                                                                    </>
                                                                ) : (
                                                                    "Resend OTP"
                                                                )}
                                                            </Button>
                                                        </>
                                                    ))}
                                            </p>
                                        </>
                                    )}
                                </div>
                            )}

                            {!certificateGenerated && otpVerified && (
                                <Button
                                    onClick={generateUDINCertificate}
                                    disabled={loadingGenerateUDIN}
                                    className="rounded-full ring-1 ring-violet-600 bg-violet-200 hover:bg-violet-500 hover:text-white group mt-6"
                                >
                                    {loadingGenerateUDIN ? "Submitting..." : "Submit Application"}
                                    <ArrowRight className="ml-2 text-violet-600 group-hover:text-white" />
                                </Button>
                            )}

                            <div className="border p-10 rounded-md bg-violet-50 shadow-sm mt-6 max-w-2xl">
                                <div className="flex flex-col gap-2 text-gray-500">
                                    <b className="flex justify-center items-center gap-2 text-lg mb-4">
                                        <AlertCircle className="h-5 w-5 text-violet-600" />
                                        Instructions
                                    </b>

                                    <span className="font-bold">Steps:</span>
                                    <ul className="list-disc list-inside text-sm space-y-1 mb-4">
                                        <li>Enter your AADHAAR no. & click on send otp button.</li>
                                        <li>Enter OTP that you'll get to your AADHAAR linked phone no.</li>
                                        <li>Generate your certificate by clicking on 'Submit' button.</li>
                                    </ul>

                                    <span className="font-bold">Technical issues & Solutions:</span>
                                    <ul className="list-disc list-inside text-sm space-y-1">
                                        <li>Please note that the AADHAAR verification process may take a few minutes or it might fail while verification several times due to server busy.</li>
                                        <li>If you encounter any issues while sending or verifying OTP, please try again later.</li>
                                        <li>If you are trying to resend otp then you will have to wait for 60 seconds.</li>
                                        <li>If the problem persists, please contact administrator or the support team.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Success Alert */}
            <AlertDialog open={finalSubmitSuccess} onOpenChange={setFinalSubmitSuccess}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex justify-center">
                            <BadgeCheck className="h-20 w-20 text-green-600 animate-pulse" />
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center mt-5">
                            <span className="text-lg font-bold">
                                Your application has been submitted successfully.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <div className="flex flex-col items-center gap-4 w-full">
                            <div className="flex justify-center items-center gap-4 flex-wrap">
                                <Link
                                    className="px-3 py-2 text-sm hover:bg-violet-600 bg-violet-500 text-white rounded-md"
                                    href="/id-card"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Download Registration Card
                                </Link>
                                <Link
                                    className="px-3 py-2 text-sm border shadow-sm hover:bg-slate-300 bg-slate-200 rounded-md"
                                    href="/worker-dashboard"
                                >
                                    Download Later
                                </Link>
                                <Link
                                    className="px-3 py-2 text-sm border shadow-sm hover:bg-slate-300 bg-slate-200 rounded-md"
                                    href={`/gig-worker-cert?aid=${applicationID}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Certificate
                                </Link>
                            </div>
                            <AlertDialogCancel className="mt-2">Close</AlertDialogCancel>
                        </div>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default SubmitApplicationPage;