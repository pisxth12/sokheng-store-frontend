
import { authApi } from "@/lib/open/auth";
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  UpdateProfileRequest,
} from "@/types/open/auth.type";
import { User } from "@/types/open/user.type";
import { useRouter } from "next/navigation";
import { createContext, useState, useCallback, useMemo, useEffect } from "react";
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
  loadUser: () => Promise<void>;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children, initialUser = null}: { children: React.ReactNode;initialUser?: User | null;  }) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState<boolean>(!initialUser);
  const router = useRouter();

  // Memoized helper function
  const mapAuthResponseToUser = useCallback((res: AuthResponse): User => ({
    id: res.userId,
    name: res.name,
    email: res.email,
    role: res.role as "ADMIN" | "USER",
    emailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }), []);




  


  const  loadUser = useCallback(async () => {
    try {
      const user = await authApi.getMe();
      setUser(user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);


  const login = useCallback(async (credentials: LoginCredentials): Promise<void>=> {
    setLoading(true);
    try {
      const res: AuthResponse = await authApi.login(credentials);
      setUser(mapAuthResponseToUser(res));
        router.push(res.role === "ADMIN" ? "/admin" : "/");
         setLoading(false); 
    } catch (error: any) {
       setLoading(false); 
      throw new Error(error.response?.data?.message || "Login failed");
    }
  }, [router, mapAuthResponseToUser]);

  const register = useCallback(async (data: RegisterCredentials): Promise<void>=> {
    setLoading(true);
    try {
      const res: AuthResponse = await authApi.register(data);
      setUser(mapAuthResponseToUser(res));
    
       setTimeout(() => {
      router.push("/")
    }, 100);
      
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }, [mapAuthResponseToUser]);

  const googleLogin = useCallback(async (idToken: string): Promise<void>=> {
    setLoading(true);
    try {
      const res: AuthResponse = await authApi.googleLogin({ idToken });
      setUser(mapAuthResponseToUser(res));
      
       setTimeout(() => {
        router.replace(res.role === "ADMIN" ? "/admin" : "/");
    }, 500);
       
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
      router.refresh();
    } catch (error: any) {
      toast.error("Please input valid data");
      throw new Error(error.response?.data?.message || "Update profile failed");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.log("Logout field:", error);
    } finally {
      setUser(null);
     window.location.replace("/");
    }
  }, []);

    useEffect(() => {
    if (!initialUser) {
      loadUser();
    }
  }, [initialUser]);

  // Memoize context value to prevent unnecessary re-renders of consumers
  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    googleLogin,
    logout,
    updateProfile,
    loadUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
  }), [user, loading, login, register, googleLogin, logout, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};