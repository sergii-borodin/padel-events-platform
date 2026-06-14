import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "session";
const PROTECTED_PATHS = ["/create-event"];

export async function middleware(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (PROTECTED_PATHS.some((p) => request.nextUrl.pathname.startsWith(p))) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Optional: verify cookie with firebase-admin here
    // (or verify only in server actions for simpler middleware)
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/create-event/:path*"],
};
