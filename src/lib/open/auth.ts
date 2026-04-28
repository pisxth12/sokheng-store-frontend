import {
  GoogleLoginRequest,
  LoginCredentials,
  RegisterCredentials,
  UpdateProfileRequest,
} from "@/types/open/auth.type";
import apiClient from "../api/client";

export const authApi = {
  login: async (data: LoginCredentials) => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterCredentials) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  // ========== NEW OTP METHODS ==========
  sendOtp: async (phoneNumber: string) => {
    const response = await apiClient.post("/auth/send-otp", { phoneNumber });
    return response.data;
  },

  verifyOtp: async (phoneNumber: string, otp: string) => {
    const response = await apiClient.post("/auth/verify-otp", { 
      phoneNumber, 
      otp 
    });
    return response.data;
  },


  googleLogin: async (idToken: GoogleLoginRequest) => {
    const response = await apiClient.post("/auth/google", idToken);
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get("/users/me");
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest) => {
    const response = await apiClient.put("/users/me", data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post("/auth/password/forgot", { email });
    return response.data;
  },

  verifyResetCode: async ( email: string ,code: string) => {
    const response = await apiClient.post("/auth/password/verify", { email ,code });
    return response.data;
  },
  resetPassword: async ( email:string, code: string, newPassword: string) => {
    const response = await apiClient.post("/auth/password/reset", {
      email,
      code,
      newPassword,
    });
    return response.data;
  },
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    const response = await apiClient.post("/auth/password/change", data);
    return response.data;
  },
};
