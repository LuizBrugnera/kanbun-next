"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

type Member = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

export default function CreateGroup() {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [availableMembers, setAvailableMembers] = useState<Member[]>([]);
  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim() === "") {
      toast({
        title: "Erro",
        description: "Por favor, insira um nome para o projeto.",
        variant: "destructive",
      });
      return;
    }
    if (selectedMembers.length === 0) {
      toast({
        title: "Erro",
        description: "Por favor, selecione pelo menos um membro para o grupo.",
        variant: "destructive",
      });
      return;
    }
    console.log("Projeto criado:", { projectName, members: selectedMembers });
    const res = await fetch("/api/group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: projectName,
        description: projectDescription,
        members: selectedMembers,
      }),
    });
    toast({
      title: "Sucesso!",
      description: `Grupo "${projectName}" criado com ${selectedMembers.length} membro(s).`,
    });
    // Resetar o formulário
    setProjectName("");
    setProjectDescription("");
    setSelectedMembers([]);
  };

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/user");
      const data = await res.json();
      setAvailableMembers(data);
    }
    fetchData();
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Criar Novo Grupo</CardTitle>
        <CardDescription>
          Defina o nome do projeto e selecione os membros para o seu novo grupo.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Nome do Projeto</Label>
            <Input
              id="project-name"
              placeholder="Digite o nome do projeto"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-name">Descrição do Projeto</Label>
            <Input
              id="project-description"
              placeholder="Escreva uma breve descrição do projeto"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Selecione os Membros</Label>
            <ScrollArea className="h-[200px] border rounded-md p-4">
              {availableMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center space-x-2 py-2"
                >
                  <Checkbox
                    id={`member-${member.id}`}
                    checked={selectedMembers.includes(member.id)}
                    onCheckedChange={() => handleMemberToggle(member.id)}
                  />
                  <Label
                    htmlFor={`member-${member.id}`}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <Avatar>
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </Label>
                </div>
              ))}
            </ScrollArea>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Criar Grupo
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
