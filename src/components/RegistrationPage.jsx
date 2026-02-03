"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  BadgeCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  NotebookPen,
  ArrowLeft,
  Smartphone,
  ShieldCheck,
  ChevronRight,
  ArrowRight
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

import Header from "@/components/Header";
import BannerLogo from "@/assets/bg_img_1.jpg";
import { createSHA256Hash } from "@/utils/crypto";
import { AadhaarSendOtp, AadhaarVerifyOtp, individualRegister } from "@/app/(auth)/registration/api";

const RegistrationPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState(1); // 1: Mobile, 2: OTP, 3: Details
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Form States
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [altMobile, setAltMobile] = useState("");

  // UI States
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => setIsMounted(true), []);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleSendOtp = async () => {
    if (mobile.length !== 10) {
      return toast({ variant: "destructive", title: "Invalid Mobile", description: "Please enter a 10-digit mobile number." });
    }

    setIsLoading(true);
    try {
      const res = await AadhaarSendOtp(mobile);
      if (res?.status === 0) {
        setStep(2);
        setResendTimer(60);
        toast({ title: "OTP Sent", description: `Code sent to +91 ${mobile}` });
      } else {
        throw new Error(res?.message);
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: err.message || "Failed to send OTP" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    setIsLoading(true);
    try {
      const res = await AadhaarVerifyOtp(mobile, otp);
      if (res?.status === 0) {
        setStep(3);
      } else {
        throw new Error(res?.message);
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Verification Failed", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!fullName || !aadhaar || !altMobile) {
      return toast({ variant: "destructive", title: "Missing Fields", description: "Please fill all required fields." });
    }

    setIsLoading(true);
    const cleanAadhaar = aadhaar.replace(/-/g, "");
    const maskedAadhaar = `xxxxxxxx${cleanAadhaar.slice(-4)}`;
    const hashedAadhaar = createSHA256Hash(cleanAadhaar);

    try {
      const res = await individualRegister(fullName, mobile, altMobile, maskedAadhaar, hashedAadhaar);
      if (res?.status === 0 || res?.status === 9) {
        setSuccessMessage(res.status === 9
          ? "Account already exists. Please login to continue."
          : "Registration successful! You can now login to complete your application.");
        setShowSuccessDialog(true);
      } else {
        throw new Error(res?.message);
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Registration Failed", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const formatAadhaar = (val) => {
    const digits = val.replace(/\D/g, "").slice(0, 12);
    const formatted = digits.match(/.{1,4}/g)?.join("-") || digits;
    setAadhaar(formatted);
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-grow flex items-center justify-center relative px-4 py-12">
        <Image src={BannerLogo} alt="Background" fill className="object-cover opacity-10" priority />
        <div className="absolute inset-0" />

        <Card className="w-full max-w-md z-10 shadow-2xl border-none bg-white/95 backdrop-blur-sm">

          <CardHeader className="bg-gradient-to-r from-violet-600 to-amber-600 p-6 flex flex-col justify-center items-center gap-0 rounded-t-lg">

            <CardTitle className="text-2xl font-bold text-center text-white tracking-tight">
              Gig Worker Registration
            </CardTitle>
            <CardDescription className="text-center text-slate-200">
              {step === 1 && "Start your registration with mobile verification"}
              {step === 2 && "Enter the verification code sent to your phone"}
              {step === 3 && "Complete your profile information"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 py-8 px-14 pt-18">
            {/* STEP 1: MOBILE */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="mobile"
                      placeholder="Enter 10 digit number"
                      className="pl-10"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    />
                  </div>
                </div>
                <Button onClick={handleSendOtp} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
                  {isLoading ? <Loader2 className="animate-spin" /> : "Verify Mobile"}
                </Button>
              </div>
            )}

            {/* STEP 2: OTP */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <div className="text-sm">
                    <p className="text-slate-500 text-xs">Verifying</p>
                    <p className="font-semibold text-blue-900">+91 {mobile}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-blue-600 text-xs h-8">
                    Change
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>One-Time Password</Label>
                  <Input
                    placeholder="6-digit OTP"
                    className="text-center tracking-[0.5em] text-xl font-bold"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  />
                </div>

                <Button onClick={handleVerifyOtp} disabled={isLoading || otp.length < 6} className="w-full bg-blue-600">
                  {isLoading ? <Loader2 className="animate-spin" /> : "Continue"}
                </Button>

                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-xs text-slate-500">Resend code in <span className="font-bold">{resendTimer}s</span></p>
                  ) : (
                    <Button variant="link" onClick={handleSendOtp} className="text-xs text-blue-600 h-auto p-0">
                      Resend OTP
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: DETAILS */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex gap-3 text-xs text-amber-800">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-amber-600" />
                  <p>Your Aadhaar is used for one-time verification only. We do not store your full Aadhaar number in our database.</p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase font-bold text-slate-500">Full Name (as per Aadhaar)</Label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase font-bold text-slate-500">Aadhaar Number</Label>
                    <div className="relative">
                      <Input
                        type={showAadhaar ? "text" : "password"}
                        value={aadhaar}
                        onChange={(e) => formatAadhaar(e.target.value)}
                        placeholder="0000-0000-0000"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAadhaar(!showAadhaar)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        {showAadhaar ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs uppercase font-bold text-slate-500">Alternative Mobile</Label>
                    <Input
                      value={altMobile}
                      onChange={(e) => setAltMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="Emergency contact number"
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <Button onClick={handleRegister} disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700">
                    {isLoading ? <Loader2 className="animate-spin" /> : (
                      <span className="flex items-center gap-2 font-semibold">
                        Complete Registration <ChevronRight size={18} />
                      </span>
                    )}
                  </Button>
                  <Button variant="ghost" onClick={() => setStep(2)} className="w-full text-slate-500">
                    <ArrowLeft size={16} className="mr-2" /> Back to OTP
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-sm text-center">
          <AlertDialogHeader>
            <div className="mx-auto bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
              <BadgeCheck className="h-12 w-12 text-green-600" />
            </div>
            <AlertDialogTitle className="text-2xl font-bold text-slate-900 text-center">Registered!</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 pt-2">
              {successMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center mt-4">
            <Link href="/login" className="w-full">
              <Button className="w-[40%] bg-blue-600 hover:bg-blue-700">
                Go to Login <ArrowRight />
              </Button>
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RegistrationPage;