"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "react-cookies";
import {
  AlertCircle,
  CheckCircle2,
  KeySquare,
  Loader2,
  Smartphone,
  PencilLine,
  ArrowRight
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import BackgroundImg from "@/assets/bg_img_1.jpg";
import {
  GenerateApiToken,
  IndividualLoginOTP,
  IndividualVerifyOTP,
} from "@/app/(auth)/login/api";

const LoginPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [isVerifiedLoading, setIsVerifiedLoading] = useState(false);
  const [resendOtpLoading, setResendOtpLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let timer;
    if (isOtpSent && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpSent, resendTimer]);

  const handleSendOtp = async (isResend = false) => {
    if (!phoneNumber.match(/^\d{10}$/)) {
      toast({
        variant: "destructive",
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
      });
      return;
    }

    isResend ? setResendOtpLoading(true) : setIsLoading(true);

    try {
      const response = await IndividualLoginOTP(phoneNumber);

      if (response?.status === 0) {
        setIsOtpSent(true);
        setResendTimer(60);
        toast({
          title: "OTP Sent Successfully",
          description: `A 6-digit code has been sent to +91 ${phoneNumber}`,
        });
      } else {
        throw new Error(response?.message || "Failed to send OTP");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
      setResendOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.match(/^\d{6}$/)) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter the 6-digit verification code.",
      });
      return;
    }

    setIsVerifiedLoading(true);

    try {
      // 1. Verify OTP
      const verifyResponse = await IndividualVerifyOTP(phoneNumber, otp);

      if (verifyResponse?.status !== 0) {
        throw new Error(verifyResponse?.message || "Incorrect OTP");
      }

      // 2. Generate API Token
      const base64_creds = btoa(`${phoneNumber}:${otp}`);
      const tokenResponse = await GenerateApiToken(base64_creds);


      // if (tokenResponse?.status != 0) {
      //   throw new Error(tokenResponse?.message || "Failed to generate access token.");
      // } 

      // 3. Store Token
      Cookies.save("access_token", tokenResponse?.data?.access_token, {
        path: "/",
        secure: true,
        sameSite: "strict",
      });

      toast({
        title: "Welcome Back!",
        description: "Login successful. Redirecting...",
      });

      router.push("/worker-dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.message,
      });
    } finally {
      setIsVerifiedLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header />



      <main className="flex-grow flex items-center justify-center relative px-4">
        {/* Background Layer */}
        <Image
          src={BackgroundImg}
          alt="Background"
          fill
          priority
          className="object-cover opacity-10"
        />
        <div className="absolute inset-0" />

        {/* Login Card */}
        <Card className="w-full max-w-md z-10 border-none shadow-2xl bg-white/95 backdrop-blur-md">
          <CardHeader className="bg-gradient-to-r from-violet-600 to-amber-600 p-6 flex flex-col justify-center items-center gap-0 rounded-t-xl">
            <CardTitle className="text-2xl font-bold text-center text-white tracking-tight">
              {isOtpSent ? "Verification" : "Gig Worker Login"}
            </CardTitle>

            <CardDescription className="text-center text-slate-200">
              {isOtpSent
                ? "Enter the code sent to your mobile device"
                : "Enter your phone number to access your account"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 mt-10">
            {!isOtpSent ? (
              /* Phone Input State */
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="Enter your phone number"
                      className="pl-10 h-12 text-lg tracking-widest focus-visible:ring-blue-500"
                      maxLength={10}
                    />
                  </div>
                </div>
                <Button
                  onClick={() => handleSendOtp(false)}
                  disabled={isLoading}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      Get OTP <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </div>
            ) : (
              /* OTP Input State */
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between border border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Sending to</span>
                    <span className="text-slate-700 font-medium">+91 {phoneNumber}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOtpSent(false)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <PencilLine className="h-4 w-4 mr-1" /> Edit
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 ml-1">
                    One-Time Password
                  </label>
                  <div className="relative">
                    <KeySquare className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="······"
                      className="pl-10 h-12 text-2xl tracking-[0.5em] text-center focus-visible:ring-blue-500"
                      maxLength={6}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={isVerifiedLoading}
                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg shadow-green-900/20"
                  >
                    {isVerifiedLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Verify & Login"
                    )}
                  </Button>

                  <div className="text-center">
                    {resendTimer === 0 ? (
                      <div className="text-sm text-slate-600">
                        Didn't receive the code?{" "}
                        <button
                          onClick={() => handleSendOtp(true)}
                          disabled={resendOtpLoading}
                          className="text-blue-600 font-bold hover:underline disabled:opacity-50"
                        >
                          {resendOtpLoading ? "Sending..." : "Resend OTP"}
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        You can request a new code in{" "}
                        <span className="font-mono font-bold text-slate-600">{resendTimer}s</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer / Legal */}
      <footer className="z-10 py-6 text-center text-white/60 text-xs">
        © {new Date().getFullYear()} GIG Worker Registration Portal. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;