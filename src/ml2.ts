/* middleware.ts 

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  // Rotas que não exigem autenticação
  const publicPaths = ["/login", "/register"];

  if (publicPaths.includes(request.nextUrl.pathname)) {
    if (token) {
      return NextResponse.redirect(new URL("/home/groups", request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verificar o token usando 'jose'
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (error) {
    // Token inválido ou expirado
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/home/:path*"],
};
*/
