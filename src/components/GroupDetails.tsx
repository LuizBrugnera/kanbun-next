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
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { group } from "console";
import { useRouter } from "next/navigation";

type Member = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

type GroupData = {
  id: number;
  name: string;
  description: string;
  users: Member[];
};

export default function GroupDetails({ id }: { id: number }) {
  const [groupData, setGroupData] = useState<GroupData>({
    id: id,
    description: "",
    name: "",
    users: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const router = useRouter();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGroupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`/api/group/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
      });

      toast({
        title: "Grupo atualizado",
        description: "As informações do grupo foram atualizadas com sucesso.",
      });

      router.push(`/home/groups`);
    } catch (error) {
      console.error("Error updating group:", error);
      toast({
        title: "Erro",
        description:
          "Ocorreu um erro ao atualizar o grupo. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    if (groupData.users.find((member) => member.email === newMemberEmail)) {
      toast({
        title: "Erro",
        description: "Este email já está no grupo.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/user/email/${newMemberEmail}`);
      if (!res.ok) {
        throw new Error("Usuário não encontrado.");
      }

      const newMember = await res.json();

      setGroupData((prev) => ({
        ...prev,
        users: [...prev.users, newMember],
      }));

      setNewMemberEmail("");

      toast({
        title: "Membro adicionado",
        description: `${newMemberEmail} foi adicionado ao grupo.`,
      });
    } catch (error) {
      console.error("Erro ao adicionar membro:", error);
      toast({
        title: "Erro",
        description: error || "Erro ao adicionar o membro.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setIsLoading(true);

    try {
      setGroupData((prev) => ({
        ...prev,
        users: prev.users.filter((member) => member.id !== memberId),
      }));

      toast({
        title: "Membro removido",
        description: "O membro foi removido do grupo com sucesso.",
      });
    } catch (error) {
      console.error("Error removing member:", error);
      toast({
        title: "Erro",
        description:
          "Ocorreu um erro ao remover o membro. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/group/${id}`);
      const data = await res.json();
      data.users.forEach((user: { user: Member }, index: number) => {
        data.users[index] = user.user;
      });
      console.log(data);
      setGroupData(data);
    }
    fetchData();
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Detalhes do Grupo</CardTitle>
          <CardDescription>
            Visualize e edite as informações do grupo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Grupo</Label>
              <Input
                id="name"
                name="name"
                value={groupData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                name="description"
                value={groupData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atualizando...
                </>
              ) : (
                "Atualizar Grupo"
              )}
            </Button>
          </form>

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Membros do Grupo</h3>
            <ScrollArea className="h-[200px] border rounded-md p-4">
              {groupData.users.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage
                        src={"/placeholder.svg?height=40&width=40"}
                        alt={member.name}
                      />
                      <AvatarFallback>{member.name}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </ScrollArea>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newMemberEmail">Adicionar Novo Membro</Label>
            <div className="flex space-x-2">
              <Input
                id="newMemberEmail"
                type="email"
                placeholder="Email do novo membro"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
              />
              <Button onClick={handleAddMember} disabled={isLoading}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Apenas administradores podem editar informações do grupo e gerenciar
            membros.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
