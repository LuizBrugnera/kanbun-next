"use client";

import { useContext, useEffect, useState } from "react";
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
import { Edit, PlusCircle, Users } from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";

type Group = {
  id: string;
  name: string;
  users: {
    user: {
      id: string;
      name: string;
      avatar: string;
    };
  }[];
};

export default function MyGroups() {
  const { user } = useContext(AuthContext);
  const [groups, setGroups] = useState<Group[]>([]);
  const router = useRouter();
  const handleCreateGroup = () => {
    router.push("/home/groups/create");
  };

  const handleAccessGroup = (groupId: string) => {
    router.push(`/home/${groupId}/kanban`);
  };
  const handleEditGroup = (groupId: string) => {
    router.push(`/home/groups/details/${groupId}`);
  };

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/group/user/${user?.id}`);
      const data = await res.json();
      setGroups(data);
    }
    fetchData();
  }, [user]);

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
              <CardDescription>{group.users.length} membros</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ScrollArea className="h-[100px]">
                <div className="flex flex-wrap gap-2">
                  {group.users.map((member) => (
                    <Avatar key={member.user.id} title={member.user.name}>
                      <AvatarImage
                        src={"/placeholder.svg?height=32&width=32"}
                        alt={member.user.name}
                      />
                      <AvatarFallback>
                        {member.user.name
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
              <div className="flex space-x-2">
                <Button
                  className="w-full"
                  onClick={() => handleAccessGroup(group.id)}
                >
                  <Users className="mr-2 h-4 w-4" /> Acessar
                </Button>
                <Button
                  className="w-full"
                  onClick={() => handleEditGroup(group.id)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Editar
                </Button>
              </div>
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
