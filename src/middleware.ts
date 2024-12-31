import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getCurrent } from "@/features/auth/server/action";

const protectedRoutes = ["/dashboard"];

export async function middleware(request: NextRequest) {
    const user = await getCurrent();

    const isProtected = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    );
    const isAdminRoute = request.nextUrl.pathname.startsWith("/dashboard");
    const isAdmin = user?.role === "Admin";

    if (!user && isProtected) {
        const signInUrl = new URL("/auth/sign-in", request.nextUrl);
        signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);

        if (request.nextUrl.pathname !== "/auth/sign-in") {
            return NextResponse.redirect(signInUrl);
        }
    }

    if (isAdminRoute && !isAdmin) {
        const dashboardUrl = new URL("/", request.nextUrl);
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};