"use client";

import { LogOut, UserCircle, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/login");
  };
  return (
    <nav className="flex items-center justify-between p-4 bg-background border-b">
      <Link href="/home/groups" className="text-xl font-bold">
        KanbanFlow
      </Link>
      <div className="flex items-center space-x-4">
        <Link href="/home/groups" className="flex items-center">
          <Users className="mr-2 h-4 w-4" />
          Meus Grupos
        </Link>
        <Link href="/home/profile" className="flex items-center">
          <UserCircle className="mr-2 h-4 w-4" />
          Meu Perfil
        </Link>
        <button className="flex items-center" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4 " />
          Sair
        </button>
      </div>
    </nav>
  );
}
