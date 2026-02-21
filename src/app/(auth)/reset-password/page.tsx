'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { authApi } from "@/lib/api/open/auth";

export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        // Check if we have verified code
        const code = sessionStorage.getItem("resetCode");
        if (!code) {
            router.push("/forgot-password");
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        const code = sessionStorage.getItem("resetCode");
        if (!code) {
            router.push("/forgot-password");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await authApi.resetPassword(code, newPassword);
            
            // Clear stored data
            sessionStorage.removeItem("resetCode");
            sessionStorage.removeItem("resetEmail");
            
            // Show success and redirect
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
            <div className="bg-white dark:bg-[#212121] border border-gray-200 dark:border-gray-800 shadow-sm p-5">
                <button
                    onClick={() => router.push("/verify-reset-code")}
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

                <form onSubmit={handleSubmit} className="space-y-3">
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
                        className="w-full py-2 px-3 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white text-xs font-medium disabled:opacity-50 transition-colors mt-2"
                    >
                        {loading ? "RESETTING..." : "RESET PASSWORD"}
                    </button>
                </form>
            </div>
        </div>
    </div>
);
}