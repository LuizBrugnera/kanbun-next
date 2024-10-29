import KanbanBoard from "@/components/KanbanBoard";
import Navbar from "@/components/Navbar";

export default function KanbanPage({ params }: { params: { id: string } }) {
  const returnKunban = async () => {
    const awaitParams = await params;
    return <KanbanBoard id={awaitParams.id} />;
  };

  return (
    <main>
      <Navbar />
      {returnKunban()}
    </main>
  );
}
