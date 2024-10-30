// app/api/tasks/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Obter todas as tarefas (GET) e criar uma nova tarefa (POST)
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        group: true,
      },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar tarefas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newTask = await prisma.task.create({ data });
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    return NextResponse.json(
      { error: "Erro ao criar tarefa" },
      { status: 500 }
    );
  }
}
