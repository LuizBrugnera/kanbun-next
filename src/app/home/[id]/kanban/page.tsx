import KanbanBoard from "@/components/KanbanBoard";
import Navbar from "@/components/Navbar";

export default function KanbanPage({ params }: any) {
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
