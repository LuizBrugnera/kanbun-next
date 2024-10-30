// app/api/auth/login/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { serialize } from "cookie";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Encontrar o usuário pelo email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // Comparar a senha fornecida com a senha hasheada
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    // Gerar um token JWT usando 'jose'
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const token = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg })
      .setExpirationTime("1h")
      .sign(secret);

    // Criar um cookie seguro
    const serializedCookie = serialize("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1 hora
      path: "/",
    });

    // Retornar a resposta com o cookie
    const response = NextResponse.json({
      message: "Login bem-sucedido",
      user: { id: user.id, name: user.name, email: user.email },
    });
    response.headers.set("Set-Cookie", serializedCookie);

    return response;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 });
  }
}
