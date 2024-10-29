"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, Users } from "lucide-react";

type Group = {
  id: string;
  name: string;
  members: {
    id: string;
    name: string;
    avatar: string;
  }[];
};

const myGroups: Group[] = [
  {
    id: "1",
    name: "Projeto A",
    members: [
      {
        id: "1",
        name: "Alice Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      {
        id: "2",
        name: "Bob Smith",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      {
        id: "3",
        name: "Charlie Brown",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    ],
  },
  {
    id: "2",
    name: "Equipe de Marketing",
    members: [
      {
        id: "4",
        name: "Diana Ross",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      {
        id: "5",
        name: "Edward Norton",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    ],
  },
  {
    id: "3",
    name: "Desenvolvimento Web",
    members: [
      {
        id: "6",
        name: "Fiona Apple",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      {
        id: "7",
        name: "George Clooney",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      {
        id: "8",
        name: "Helen Mirren",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      {
        id: "9",
        name: "Ian McKellen",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    ],
  },
];

export default function MyGroups() {
  const [groups, setGroups] = useState<Group[]>(myGroups);
  const router = useRouter();

  const handleCreateGroup = () => {
    router.push("/home/groups/create");
  };

  const handleAccessGroup = (groupId: string) => {
    router.push(`/home/${groupId}/kanban`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Meus Grupos</h1>
        <Button onClick={handleCreateGroup}>
          <PlusCircle className="mr-2 h-4 w-4" /> Criar Novo Grupo
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{group.name}</CardTitle>
              <CardDescription>{group.members.length} membros</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ScrollArea className="h-[100px]">
                <div className="flex flex-wrap gap-2">
                  {group.members.map((member) => (
                    <Avatar key={member.id} title={member.name}>
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleAccessGroup(group.id)}
              >
                <Users className="mr-2 h-4 w-4" /> Acessar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {groups.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">Você ainda não tem grupos.</p>
          <Button onClick={handleCreateGroup} className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" /> Criar Seu Primeiro Grupo
          </Button>
        </div>
      )}
    </div>
  );
}
