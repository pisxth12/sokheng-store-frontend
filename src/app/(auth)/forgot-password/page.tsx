"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft } from "lucide-react";
import { authApi } from "@/lib/open/auth";
import { useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
  const t = useTranslations("Auth");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authApi.forgotPassword(email);
      setSuccess(true);
      sessionStorage.setItem("resetEmail", email);
    } catch (err: any) {
      setError(err.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] dark:bg-[#1a1a1a] p-3">
        <div className="w-full max-w-[320px]">
          <div className="bg-white dark:bg-[#212121] border border-gray-200 dark:border-gray-800 shadow-sm p-5">
            <div className="text-center mb-4">
              <h1 className="text-base font-medium tracking-wider text-gray-900 dark:text-white">
                {t("checkEmail.title")}
              </h1>
            </div>

            <div className="mb-4 text-center">
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                {t("checkEmail.message")}
              </p>
              <p className="text-xs font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-[#2a2a2a] py-2 px-3 border border-gray-200 dark:border-gray-700">
                {email}
              </p>
            </div>

            <p className="text-[9px] text-gray-400 dark:text-gray-500 text-center mb-4 uppercase tracking-wider">
              {t("checkEmail.expires")}
            </p>

            <button
              onClick={() => router.push("/verify-reset-code")}
              className="w-full py-2 px-3 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white text-xs font-medium transition-colors"
            >
              {t("checkEmail.button")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] dark:bg-[#1a1a1a] p-3">
      <div className="w-full max-w-[320px]">
        <div className="bg-white dark:bg-[#212121] border border-gray-200 dark:border-gray-800 shadow-sm p-5">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-[9px] text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 uppercase tracking-wider mb-4"
          >
            <ArrowLeft className="w-3 h-3" />
            {t("forgotPassword.back")}
          </button>

          <div className="text-center mb-4">
            <h1 className="text-base font-medium tracking-wider text-gray-900 dark:text-white">
              {t("forgotPassword.title")}
            </h1>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider">
              {t("forgotPassword.subtitle")}
            </p>
          </div>

          {error && (
            <div className="mb-3 p-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
              <p className="text-[11px] text-red-600 dark:text-red-400 text-center">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                {t("forgotPassword.email.label")}
              </label>
              <div className="relative">
                <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 text-xs bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder={t("forgotPassword.email.placeholder")}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-3 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white text-xs font-medium disabled:opacity-50 transition-colors"
            >
              {loading
                ? t("forgotPassword.sending")
                : t("forgotPassword.button")}
            </button>
          </form>

          <p className="mt-4 text-center text-[9px] text-gray-500 dark:text-gray-400">
            {t("forgotPassword.rememberPassword")}{" "}
            <button
              onClick={() => router.push("/login")}
              className="font-medium text-gray-900 dark:text-white hover:underline"
            >
              {t("forgotPassword.login")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
