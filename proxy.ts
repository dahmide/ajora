import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// 1. Specify protected and public routes
const secretRoutes = ["/overview"];
const publicRoutes = ["/signin", "/signup", "/"];

export default async function proxy(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname;
    const isSecretRoute = secretRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    // 3. Decrypt the session from the cookie
    const cookie = getSessionCookie(req);
    // const session = cookie;

    // 4. Redirect to /sign-in if the user is not authenticated
    if (isSecretRoute && cookie === null) {
        return NextResponse.redirect(new URL("/signin", req.nextUrl));
    }

    // 5. Redirect to /overview if the user is authenticated
    if (isPublicRoute && cookie !== null) {
        //!req.nextUrl.pathname.startsWith('/dashboard')
        return NextResponse.redirect(new URL("/groups", req.nextUrl));
    }

    return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
