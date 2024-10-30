// app/api/groups/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      include: {
        users: {
          include: {
            user: true,
          },
        },
        tasks: true,
      },
    });
    return NextResponse.json(groups);
  } catch (error) {
    console.error("Erro ao buscar grupos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar grupos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, description, members } = data;

    if (!name) {
      return NextResponse.json(
        { error: "O nome do grupo é obrigatório" },
        { status: 400 }
      );
    }

    const newGroup = await prisma.group.create({
      data: {
        name,
        description,
      },
    });

    if (Array.isArray(members) && members.length > 0) {
      const userGroupData = members.map((userId: string) => ({
        user_id: userId,
        group_id: newGroup.id,
      }));

      await prisma.userGroup.createMany({
        data: userGroupData,
      });
    }

    const groupWithMembers = await prisma.group.findUnique({
      where: { id: newGroup.id },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    return NextResponse.json(groupWithMembers, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar grupo:", error);
    return NextResponse.json({ error: "Erro ao criar grupo" }, { status: 500 });
  }
}
