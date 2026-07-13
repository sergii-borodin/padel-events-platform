import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";

const SESSION_COOKIE_NAME = "session";
const EXPIRES_IN = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
    expiresIn: EXPIRES_IN,
  });

  const response = NextResponse.json({ status: "ok" });
  response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: EXPIRES_IN / 1000,
    path: "/",
    sameSite: "lax",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ status: "ok" });
  response.cookies.delete(SESSION_COOKIE_NAME);
  return response;
}
