import {
  GoogleLoginRequest,
  LoginCredentials,
  RegisterCredentials,
  UpdateProfileRequest,
} from "@/types/open/auth.type";
import apiClient from "./client";

export const authApi = {
  login: async (data: LoginCredentials) => {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterCredentials) => {
    const response = await apiClient.post("/auth/register", data);
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

  updateProfile: async (data: UpdateProfileRequest)=>{
    const response = await apiClient.put("/users/me", data);
    return response.data;
  },



  forgotPassword: async (email: string) => {
    const response = await apiClient.post("/auth/password/forgot", { email });
    return response.data;
  },

  verifyResetCode: async (code: string) => {
    const response = await apiClient.post("/auth/password/verify", { code });
    return response.data;
  },
  resetPassword: async (code: string, newPassword: string) => {
    const response = await apiClient.post("/auth/password/reset", {
      code,
      newPassword,
    });
    return response.data;
  },
  changePassword: async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
  const response = await apiClient.post("/auth/password/change", data);
  return response.data;
}
};
