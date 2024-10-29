import KanbanBoard from "@/components/KanbanBoard";
import PublicNavbar from "@/components/PublicNavbar";

export default function KanbanPage() {
  return (
    <main>
      <PublicNavbar />
      <KanbanBoard id="1" />
    </main>
  );
}
