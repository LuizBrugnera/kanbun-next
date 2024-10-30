import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, context: any) {
  try {
    const { userId } = context.params;
    if (!userId) throw new Error("User ID is missing.");

    const groups = await prisma.group.findMany({
      include: {
        users: {
          include: {
            user: true,
          },
        },
        tasks: true,
      },
      where: {
        users: {
          some: {
            user_id: userId,
          },
        },
      },
    });

    console.log(userId);
    return NextResponse.json(groups);
  } catch (error) {
    console.error("Erro ao buscar grupos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar grupos" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: any) {
  try {
    const { userId } = context.params;
    if (!userId) throw new Error("User ID is missing.");

    const { name, email } = await request.json();

    if (!name && !email) {
      return NextResponse.json(
        { error: "É necessário fornecer ao menos um campo para atualização." },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
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
