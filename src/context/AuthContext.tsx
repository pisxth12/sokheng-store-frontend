import { authApi } from "@/lib/open/auth";
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  UpdateProfileRequest,
} from "@/types/open/auth.type";
import { User } from "@/types/open/user.type";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState, useCallback, useMemo } from "react";
import toast from "react-hot-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Memoized helper function
  const mapAuthResponseToUser = useCallback((res: AuthResponse): User => ({
    id: res.userId.toString(),
    name: res.name,
    email: res.email,
    role: res.role as "ADMIN" | "USER",
    emailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }), []);

  // Check auth on mount
  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const user = await authApi.getMe();
        if (mounted) setUser(user);
      } catch (error) {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const res: AuthResponse = await authApi.login(credentials);
      setUser(mapAuthResponseToUser(res));
      
            window.location.href = res.role === "ADMIN" ? "/admin" : "/";
        
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }, [router, mapAuthResponseToUser]);

  const register = useCallback(async (data: RegisterCredentials) => {
    setLoading(true);
    try {
      const res: AuthResponse = await authApi.register(data);
      setUser(mapAuthResponseToUser(res));
    
      window.location.href = res.role === "ADMIN" ? "/admin" : "/";
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }, [mapAuthResponseToUser]);

  const googleLogin = useCallback(async (idToken: string) => {
    setLoading(true);
    try {
      const res: AuthResponse = await authApi.googleLogin({ idToken });
      setUser(mapAuthResponseToUser(res));
      
       window.location.replace(res.role === "ADMIN" ? "/admin" : "/");
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  }, [mapAuthResponseToUser]);

  const updateProfile = useCallback(async (data: UpdateProfileRequest): Promise<void> => {
    setLoading(true);
    try {
      const res: AuthResponse = await authApi.updateProfile(data);

      setUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          name: res.name,
          phone: res.phone || prev.phone,
          address: res.address || prev.address,
          updatedAt: new Date().toISOString(),
        };
      });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error("Please input valid data");
      throw new Error(error.response?.data?.message || "Update profile failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.log("Logout field:", error);
    } finally {
      setUser(null);
      window.location.href = '/';
    }
  }, [router]);

  // Memoize context value to prevent unnecessary re-renders of consumers
  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    googleLogin,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
  }), [user, loading, login, register, googleLogin, logout, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};