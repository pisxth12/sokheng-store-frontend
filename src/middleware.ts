
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest){
    const { pathname } = request.nextUrl;
    
    const isAuthPage = pathname === "/login" || pathname === "/register";

    
   
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};