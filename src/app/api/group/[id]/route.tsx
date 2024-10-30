import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    const group = await prisma.group.findUnique({
      where: { id: Number(id) },
      include: {
        tasks: {
          include: {
            User: true,
          },
        },
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    if (group) {
      return NextResponse.json(group);
    } else {
      return NextResponse.json(
        { error: "Grupo não encontrado" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Erro ao buscar grupo:", error);
    return NextResponse.json(
      { error: "Erro ao buscar grupo" },
      { status: 500 }
    );
  }
}

// Função para atualizar um grupo específico
export async function PUT(request: NextRequest, context: any) {
  try {
    const data = await request.json();
    const { id, name, description, users } = data;

    if (!id) {
      return NextResponse.json(
        { error: "O ID do grupo é obrigatório" },
        { status: 400 }
      );
    }

    const updatedGroup = await prisma.group.update({
      where: { id: Number(id) },
      data: { name, description },
    });

    const existingMembers = await prisma.userGroup.findMany({
      where: { group_id: Number(id) },
      select: { user_id: true },
    });

    const existingMemberIds = existingMembers.map((member) => member.user_id);
    const newMemberIds = Array.isArray(users) ? users : [];

    const usersToAdd = newMemberIds.filter(
      (user: { id: string }) => !existingMemberIds.includes(user.id)
    );

    const usersToRemove = existingMemberIds.filter(
      (id) => !newMemberIds.some((member: { id: string }) => member.id === id)
    );

    if (usersToAdd.length > 0) {
      const userGroupData = usersToAdd.map((user: { id: string }) => ({
        user_id: user.id,
        group_id: Number(id),
      }));
      await prisma.userGroup.createMany({
        data: userGroupData,
      });
    }

    if (usersToRemove.length > 0) {
      await prisma.userGroup.deleteMany({
        where: {
          group_id: Number(id),
          user_id: { in: usersToRemove },
        },
      });
    }

    const groupWithMembers = await prisma.group.findUnique({
      where: { id: Number(id) },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(groupWithMembers, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar grupo:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar grupo" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: any) {
  try {
    const { id } = context.params;
    await prisma.task.delete({ where: { id: String(id) } });
    return NextResponse.json({ message: "Tarefa excluída" });
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    return NextResponse.json(
      { error: "Erro ao excluir tarefa" },
      { status: 500 }
    );
  }
}
