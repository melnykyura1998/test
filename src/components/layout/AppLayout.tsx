import { useNavigationStore } from "@/store/navigationStore";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { DataroomList } from "@/components/dataroom/DataroomList";
import { ExplorerGrid } from "@/components/explorer/ExplorerGrid";

export function AppLayout() {
  const { dataroomId } = useNavigationStore();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {dataroomId ? <ExplorerGrid /> : <DataroomList />}
        </main>
      </div>
    </div>
  );
}
