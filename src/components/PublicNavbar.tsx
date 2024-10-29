import Link from "next/link";

export default function PublicNavbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-background border-b">
      <Link href="/" className="text-xl font-bold">
        KanbanFlow
      </Link>
      <div className="flex items-center space-x-4">
        <Link href="/login" className="flex items-center">
          Entrar
        </Link>
        <Link href="/login" className="flex items-center">
          Criar conta
        </Link>
      </div>
    </nav>
  );
}
