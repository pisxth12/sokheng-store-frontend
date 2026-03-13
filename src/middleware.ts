import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("token")?.value;

    // Skip static files
    if (
        pathname.includes("/_next") ||
        pathname.includes("/api") ||
        pathname.includes("/favicon.ico") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    const publicRoutes = [
        '/',
        '/products',
        '/cart',
        '/login',
        '/register',
        '/checkout/guest',
    ];


    const isPublicRoute = publicRoutes.some((route) => {
        return pathname === route || pathname.startsWith(route + '/');
    });

    if (isPublicRoute) {
        if (pathname === '/checkout/guest' && token) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    const isProtectedRoute = pathname.startsWith("/checkout") || 
                             pathname.startsWith("/profile") ;
                            //  pathname.startsWith("/orders");

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL("/checkout/guest", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};