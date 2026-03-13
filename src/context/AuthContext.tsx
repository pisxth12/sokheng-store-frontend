import { authApi } from "@/lib/api/open/auth";
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  UpdateProfileRequest,
} from "@/types/open/auth.type";
import { User } from "@/types/open/user.type";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
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

  useEffect(() => {
    checkAuth();
  }, []);
  const checkAuth = async () => {
 
    try {
      const user = await authApi.getMe();
      setUser(user);
    } catch (error) {
      console.log("Auth check field:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const res: AuthResponse = await authApi.login(credentials);
      setUser({
        id: res.userId.toString(),
        name: res.name,
        email: res.email,
        role: res.role as "ADMIN" | "USER",
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      if (res.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterCredentials) => {
    try {
      const res: AuthResponse = await authApi.register(data);
      setUser({
        id: res.userId.toString(),
        name: res.name,
        email: res.email,
        role: res.role as "ADMIN" | "USER",
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      if (res.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (idToken: string) => {
    try {
      const res: AuthResponse = await authApi.googleLogin({ idToken });
      setUser({
        id: res.userId.toString(),
        name: res.name,
        email: res.email,
        role: res.role as "ADMIN" | "USER",
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      if (res.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileRequest): Promise<void> => {
    setLoading(true);
    try {
      const res: AuthResponse = await authApi.updateProfile(data);
    
    setUser(prev => {
      if (!prev) return null;
      return {
       ...prev,
        name: res.name,
        phone: res.phone || prev.phone,
        address: res.address || prev.address,
        updatedAt: new Date().toISOString()
      };
    });
      toast.success('Profile updated successfully');
     
  }catch(error:any){
    toast.error("Please input valid data");
    throw new Error(error.response?.data?.message || "Update profile failed");
  }finally{
    setLoading(false);
  }
}
  

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.log("Logout field:", error);
    } finally {
      setUser(null);
      router.push("/");
    }
  };

  const values = {
    user,
    loading,
    login,
    register,
    googleLogin,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
