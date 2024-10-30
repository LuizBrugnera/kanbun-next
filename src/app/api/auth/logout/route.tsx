// app/api/auth/logout/route.ts

import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  const serializedCookie = serialize("authToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
    path: "/",
  });

  const response = NextResponse.json({ message: "Logout bem-sucedido" });
  response.headers.set("Set-Cookie", serializedCookie);

  return response;
}
