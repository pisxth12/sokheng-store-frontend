"use client"
import { useAuth } from "@/hooks/open/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

   
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/checkout');  
        }
    }, [isAuthenticated, router]);

    // Also fix the navigate error in button
    const handleGuestContinue = () => {
        router.push('/checkout/guest');
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            {/* Header */}
            <div className="text-center pt-12 pb-8">
                <h1 className="text-3xl font-bold">Complete Your Purchase</h1>
                <p className="text-gray-400 mt-2">Please login or continue as guest</p>
            </div>

            {/* Split Container */}
            <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-6">
                
                {/* LEFT: Guest Option */}
                <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#252525]">
                    <div className="w-12 h-12 bg-[#252525] rounded-xl flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Continue as Guest</h2>
                    <p className="text-gray-400 text-sm mb-4">Quick checkout without account</p>
                    <button 
                        onClick={handleGuestContinue}  // 👈 Fixed
                        className="w-full bg-[#252525] hover:bg-[#303030] py-3 rounded-xl font-medium transition-all"
                    >
                        Continue as Guest
                    </button>
                </div>

                {/* RIGHT: Login Option */}
                <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-6 border border-purple-500/30">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Sign In</h2>
                    <p className="text-gray-400 text-sm mb-4">Access your account</p>
                    
                    {/* Login Form */}
                    <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                        <input 
                            type="email"
                            placeholder="Email"
                            className="w-full bg-[#252525] border border-[#303030] rounded-xl px-4 py-2.5 text-sm"
                        />
                        <input 
                            type="password"
                            placeholder="Password"
                            className="w-full bg-[#252525] border border-[#303030] rounded-xl px-4 py-2.5 text-sm"
                        />
                        <button 
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-2.5 rounded-xl font-medium text-sm"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Google Button */}
                    <button className="w-full bg-white hover:bg-gray-100 text-gray-900 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 mt-3">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                </div>
            </div>
        </div>
    );
}