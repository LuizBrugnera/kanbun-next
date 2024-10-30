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
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        group: true,
      },
    });
    if (task) {
      return NextResponse.json(task);
    } else {
      return NextResponse.json(
        { error: "Tarefa não encontrada" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Erro ao buscar tarefa:", error);
    return NextResponse.json(
      { error: "Erro ao buscar tarefa" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();

    const oldTask = await prisma.task.findUnique({
      where: { id },
      include: { group: true, User: true },
    });

    if (!oldTask) {
      return NextResponse.json(
        { error: "Tarefa não encontrada" },
        { status: 404 }
      );
    }

    const updateData = {
      content: data.content ?? oldTask.content,
      assignee: data.assignee ?? oldTask.assignee,
      stage: data.stage ?? oldTask.stage,
      createdAt: oldTask.createdAt,
      deadLine: data.deadLine ?? oldTask.deadLine,
      groupId: data.groupId ?? oldTask.groupId,
      userId: data.userId ?? oldTask.userId,
    };

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar tarefa" },
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
