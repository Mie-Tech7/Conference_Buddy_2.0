import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        const token = req.nextauth.token;

        // If user is authenticated and trying to access auth pages, redirect to dashboard
        if (token && pathname.startsWith("/auth")) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                // Public routes - allow access
                if (
                    pathname === "/" ||
                    pathname.startsWith("/auth") ||
                    pathname.startsWith("/api/auth") ||
                    pathname.startsWith("/_next") ||
                    pathname.startsWith("/icons") ||
                    pathname === "/manifest.json" ||
                    pathname === "/favicon.ico"
                ) {
                    return true;
                }

                // Protected routes - require authentication
                return !!token;
            },
        },
    }
);

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json).*)",
    ],
};
