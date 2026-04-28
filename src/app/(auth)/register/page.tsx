"use client";
import { useAuth } from "@/hooks/open/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, Phone, CheckCircle } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import OtpModal from "@/components/open/accounts/OtpModal";
import { authApi } from "@/lib/open/auth";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+855969851100",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const { register, googleLogin } = useAuth();
  const router = useRouter();

  const formatPhone = (phone: string) => {
  if (!phone || phone.trim() === "") return "";
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 9 || cleaned.length > 10) {
    return phone;
  }
  if (phone.startsWith('+855')) {
    return '+' + cleaned;
  }
  if (phone.startsWith('0')) {
    return '+855' + cleaned.substring(1);
  }
  if (cleaned.startsWith('855')) {
    return '+' + cleaned;
  }
  return '+855' + cleaned;
}

 
  const handleSendOtp = async () => {
    const formattedPhone = formatPhone(formData.phone);
    if (!formattedPhone || formattedPhone.length < 12 || formattedPhone.length > 13) {
    setError("Please enter a valid Cambodia phone number (9-10 digits)");
    return;
  }
    
    if (!formattedPhone) {
      setError("Please enter a valid phone number");
      return;
    }
    
    setOtpLoading(true);
    setError(null);
    
    try {
      
      await authApi.sendOtp(formattedPhone);
      setShowOtpModal(true);
      toast.success("OTP sent to your phone");
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to send OTP");
      toast.error("Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle verifying OTP
  const handleVerifyOtp = async (otp: string) => {
    try {
      const formattedPhone = formatPhone(formData.phone);
      
      await authApi.verifyOtp( formattedPhone || formData.phone, otp);
      
      setIsPhoneVerified(true);
      setShowOtpModal(false);
      toast.success("Phone verified successfully!");
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Invalid OTP");
    }
  };

  // Handle resending OTP
  const handleResendOtp = async () => {
    try {
      await authApi.sendOtp(formData.phone);
      toast.success("OTP resent successfully");
      return Promise.resolve();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
      throw new Error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPhoneVerified) {
      setError("Please verify your phone number first");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await register(formData);
      toast.success("Registration successful!");
    } catch (error: any) {
      setError(error.message );
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      await googleLogin(credentialResponse.credential);
    } catch (error: any) {
      setError(error.message || "Google login failed");
      toast.error(error.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] dark:bg-[#1a1a1a] p-3">
      <div className="w-full max-w-[320px]">
        <div className="bg-white dark:bg-[#212121] border border-gray-200 dark:border-gray-800 shadow-sm p-5">
          {/* Brand */}
          <div className="text-center mb-4">
            <h1 className="text-base font-medium tracking-wider text-gray-900 dark:text-white">
              VANESSA BABY SHOP
            </h1>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 uppercase tracking-wider">
              Create Account
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-3 p-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
              <p className="text-[11px] text-red-600 dark:text-red-400 text-center">
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Name Field */}
            <div>
              <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  name="name"
                  className="w-full pl-7 pr-3 py-2 text-xs bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 outline-none text-gray-900 dark:text-white placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                  className="w-full pl-7 pr-3 py-2 text-xs bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 outline-none text-gray-900 dark:text-white placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {/* Phone Field with Verification */}
            <div>
              <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+855 12 345 678"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isPhoneVerified}
                    className="w-full pl-7 pr-3 py-2 text-xs bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                  {isPhoneVerified && (
                    <CheckCircle className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
                {!isPhoneVerified && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading || !formData.phone || formData.phone.length < 10}
                    className="px-3 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white text-xs font-medium disabled:opacity-50 whitespace-nowrap"
                  >
                    {otpLoading ? "Sending..." : "Verify"}
                  </button>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  name="password"
                  className="w-full pl-7 pr-8 py-2 text-xs bg-gray-50 dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 outline-none text-gray-900 dark:text-white placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading || !isPhoneVerified}
              className="w-full py-2 px-3 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white text-xs font-medium flex items-center justify-center gap-1.5 disabled:opacity-50 mt-3"
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 border border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                  <span>CREATING...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>CREATE ACCOUNT</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white dark:bg-[#212121] text-[8px] text-gray-400 uppercase tracking-wider">
                Or
              </span>
            </div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login failed")}
              theme="outline"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="100%"
            />
          </div>

          {/* Login Link */}
          <p className="mt-4 text-center text-[9px] text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="font-medium text-gray-900 dark:text-white hover:underline"
            >
              Sign in
            </button>
          </p>

          {/* Password Hint */}
          <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <p className="text-[8px] text-gray-400 text-center">
              Minimum 6 characters
            </p>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        phone={formData.phone}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
      />
    </div>
  );
};

export default RegisterPage;