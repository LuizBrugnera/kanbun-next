import CreateGroup from "@/components/CreateGroup";
import Navbar from "@/components/Navbar";
import { Fragment } from "react";

export default function GroupCreationPage() {
  return (
    <Fragment>
      <Navbar />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Criar Novo Grupo de Projeto</h1>
        <CreateGroup />
      </main>
    </Fragment>
  );
}
