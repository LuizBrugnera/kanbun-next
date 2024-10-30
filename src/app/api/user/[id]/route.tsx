// app/api/users/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, context: any) {
  try {
    const { id } = context.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        groups: {
          include: {
            group: true,
          },
        },
      },
    });
    if (user) {
      return NextResponse.json(user);
    } else {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuário" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: any) {
  try {
    const { id } = context.params;
    const data = await request.json();

    if (data.password) {
      const bcrypt = require("bcrypt");
      const saltRounds = 10;
      data.password = await bcrypt.hash(data.password, saltRounds);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar usuário" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const { id } = context.params;
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "Usuário excluído" });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return NextResponse.json(
      { error: "Erro ao excluir usuário" },
      { status: 500 }
    );
  }
}
