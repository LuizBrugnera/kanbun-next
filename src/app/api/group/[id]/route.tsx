// app/api/tasks/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Operações com uma tarefa específica
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const group = await prisma.group.findUnique({
      where: { id: +id },
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
        { error: "Grupo não encontrada" },
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

export async function PUT(request: Request) {
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
      where: { id: id },
      data: { name, description },
    });

    const existingMembers = await prisma.userGroup.findMany({
      where: { group_id: id },
      select: { user_id: true },
    });

    const existingMemberIds = existingMembers.map((member) => member.user_id);
    const newMemberIds = Array.isArray(users) ? users : [];

    const usersToAdd = newMemberIds.filter(
      (user) => !existingMemberIds.includes(user.id)
    );

    const usersToRemove = existingMemberIds.filter(
      (id) => !newMemberIds.some((member) => member.id === id)
    );

    if (usersToAdd.length > 0) {
      const userGroupData = usersToAdd.map((userId: { id: string }) => ({
        user_id: userId.id,
        group_id: id,
      }));
      console.log(userGroupData);
      await prisma.userGroup.createMany({
        data: userGroupData,
      });
    }

    if (usersToRemove.length > 0) {
      console.log(usersToRemove);
      await prisma.userGroup.deleteMany({
        where: {
          group_id: id,
          user_id: { in: usersToRemove },
        },
      });
    }

    const groupWithMembers = await prisma.group.findUnique({
      where: { id: id },
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ message: "Tarefa excluída" });
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    return NextResponse.json(
      { error: "Erro ao excluir tarefa" },
      { status: 500 }
    );
  }
}
