'use client'

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Key, Lock, Eye, EyeOff, ArrowLeft, Shield, Mail } from "lucide-react";
import { authApi } from "@/lib/api/open/auth";


export default function VerifyResetCodePage() {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [step, setStep] = useState<"code" | "password">("code");
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    
    const router = useRouter();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        const storedEmail = sessionStorage.getItem("resetEmail");
        if (!storedEmail) {
            router.push("/forgot-password");
        } else {
            setEmail(storedEmail);
        }
    }, [router]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleCodeChange = (index: number, value: string) => {
        if (value.length > 1) return;
        
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleCodeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const codeString = code.join("");
        
        if (codeString.length !== 6) {
            setError("Please enter all 6 digits");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await authApi.verifyResetCode(codeString);
            sessionStorage.setItem("resetCode", codeString);
            setStep("password");
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid code");
            setCode(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!email || resendLoading || countdown > 0) return;

        setResendLoading(true);
        try {
            await authApi.forgotPassword(email);
            setCountdown(60);
            setError("");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to resend code");
        } finally {
            setResendLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const storedCode = sessionStorage.getItem("resetCode");
            
            if (!storedCode) {
                setError("Session expired. Please start over.");
                router.push("/forgot-password");
                return;
            }
            
            await authApi.resetPassword(storedCode, newPassword);
            
            sessionStorage.removeItem("resetCode");
            sessionStorage.removeItem("resetEmail");
            
            router.push("/login?reset=success");
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] dark:bg-[#1a1a1a] p-3">
        <div className="w-full max-w-[320px]">
            {step === "code" ? (
                // VERIFY CODE FORM - Matching Login colors
                <div className="bg-white dark:bg-[#212121] border border-gray-200 dark:border-gray-800 shadow-sm p-5">
                    <button
                        onClick={() => router.push("/forgot-password")}
                        className="flex items-center gap-1 text-[9px] text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 uppercase tracking-wider mb-4"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Back
                    </button>

                    <div className="text-center mb-4">
                        <h1 className="text-base font-medium tracking-wider text-gray-900 dark:text-white">
                            VERIFY CODE
                        </h1>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider">
                            Enter the 6-digit code
                        </p>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 text-center">
                        We sent a code to:<br />
                        <span className="font-medium text-gray-900 dark:text-white">{email}</span>
                    </p>

                    {error && (
                        <div className="mb-3 p-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
                            <p className="text-[11px] text-red-600 dark:text-red-400 text-center">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleCodeSubmit} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                Verification Code
                            </label>
                            <div className="flex gap-1 justify-between">
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-10 h-10 text-center text-xs bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 outline-none text-gray-900 dark:text-white"
                                        autoFocus={index === 0}
                                        disabled={loading}
                                    />
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-3 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white text-xs font-medium disabled:opacity-50"
                        >
                            {loading ? "VERIFYING..." : "VERIFY CODE"}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <button
                            onClick={handleResendCode}
                            disabled={resendLoading || countdown > 0}
                            className="text-[9px] text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 uppercase tracking-wider disabled:opacity-50"
                        >
                            {resendLoading ? "SENDING..." : 
                             countdown > 0 ? `RESEND IN ${countdown}S` : "RESEND CODE"}
                        </button>
                    </div>
                </div>
            ) : (
                // RESET PASSWORD FORM - Matching Login colors
                <div className="bg-white dark:bg-[#212121] border border-gray-200 dark:border-gray-800 shadow-sm p-5">
                    <button
                        onClick={() => setStep("code")}
                        className="flex items-center gap-1 text-[9px] text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 uppercase tracking-wider mb-4"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Back
                    </button>

                    <div className="text-center mb-4">
                        <h1 className="text-base font-medium tracking-wider text-gray-900 dark:text-white">
                            NEW PASSWORD
                        </h1>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider">
                            Choose a strong password
                        </p>
                    </div>

                    {error && (
                        <div className="mb-3 p-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
                            <p className="text-[11px] text-red-600 dark:text-red-400 text-center">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handlePasswordSubmit} className="space-y-3">
                        <div>
                            <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-7 pr-8 py-2 text-xs bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                    placeholder="Minimum 6 characters"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
                                    ) : (
                                        <Eye className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-7 pr-8 py-2 text-xs bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                    placeholder="Re-enter password"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
                                    ) : (
                                        <Eye className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {newPassword && newPassword.length < 6 && (
                            <p className="text-[9px] text-red-500 dark:text-red-400">
                                Password must be at least 6 characters
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-3 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white text-xs font-medium disabled:opacity-50 mt-2"
                        >
                            {loading ? "RESETTING..." : "RESET PASSWORD"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    </div>
);
}