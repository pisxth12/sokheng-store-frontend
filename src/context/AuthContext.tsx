

import { authApi } from "@/lib/api/open/auth";
import { AuthResponse, LoginCredentials, RegisterCredentials } from "@/types/auth.type";
import { User } from "@/types/user.type";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login:(credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    googleLogin: (idToken: string) => Promise<void>;
    logout: () => Promise<void>;
    isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    },[]);
    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        try{
            const user = await authApi.getMe();
            setUser(user);
        }catch(error){
            console.log("Auth check field:",error);
            setUser(null);
        }finally{
            setLoading(false);
        }
    }

    const login = async (credentials: LoginCredentials) => {
        try{
            const res: AuthResponse = await authApi.login(credentials);
           localStorage.setItem("token", res.token);
           setUser({
            id: res.userId.toString(),
            name: res.name,
            email: res.email,
            role: res.role as "ADMIN" | "USER",
            emailVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
           });
           if(res.role === "ADMIN"){
                router.push("/admin");
            }else{
                router.push("/");   
            }
        }catch(error : any){
             throw new Error(error.response?.data?.message || "Login failed");
        }finally{
            setLoading(false);
        }    
    };

    const register = async (data: RegisterCredentials) => {
        try{
            const res: AuthResponse = await authApi.register(data);
            localStorage.setItem("token", res.token);
            setUser({
                id: res.userId.toString(),
                name: res.name,
                email: res.email,
                role: res.role as "ADMIN" | "USER", 
                emailVerified: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
            if(res.role === "ADMIN"){
                router.push("/admin");
            }else{
                router.push("/");   
            }
        }catch(error : any){
            throw new Error(error.response?.data?.message || "Register failed");
        }finally{
            setLoading(false);
        }
    }

    const googleLogin = async (idToken: string) => {
        try{
            const res: AuthResponse = await authApi.googleLogin({idToken});
            localStorage.setItem("token", res.token);
            setUser({
                id: res.userId.toString(),
                name: res.name,
                email: res.email,
                role: res.role as "ADMIN" | "USER",
                emailVerified: true,    
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
            if(res.role === "ADMIN"){
                router.push("/admin");
            }else{
                router.push("/");   
            }
        }catch(error: any){
            throw new Error(error.response?.data?.message || "Google login failed");
        }finally{
            setLoading(false);
        }
    }

    const logout = async () => {
        try{
            await authApi.logout();
    
        }catch(error){
            console.log("Logout field:",error);
        }finally{
            localStorage.removeItem("token");
            setUser(null);
            router.push("/");
        }
    }

    const  values = {
        user,
        loading,
        login,
        register,
        googleLogin,
        logout,
        isAdmin: user?.role === "ADMIN",
    };

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    );
 }