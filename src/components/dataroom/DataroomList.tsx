import { useState } from "react";
import { Plus, Database } from "lucide-react";
import { useDatarooms } from "@/hooks/useDatarooms";
import { useNavigationStore } from "@/store/navigationStore";
import { DataroomCard } from "./DataroomCard";
import { CreateDataroomDialog } from "./CreateDataroomDialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";

export function DataroomList() {
  const { datarooms, loading, create, rename, remove } = useDatarooms();
  const { openDataroom } = useNavigationStore();
  const [createOpen, setCreateOpen] = useState(false);

  async function handleCreate(name: string): Promise<string | void> {
    try {
      await create(name);
      setCreateOpen(false);
    } catch (e) {
      return e instanceof Error ? e.message : "Something went wrong.";
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-6 w-36 rounded-md bg-muted animate-pulse" />
          <div className="h-9 w-32 rounded-md bg-muted animate-pulse" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Data Rooms</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {datarooms.length === 0
              ? "No data rooms yet"
              : `${datarooms.length} data room${datarooms.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} size="sm">
          <Plus className="h-4 w-4" />
          New Data Room
        </Button>
      </div>

      {datarooms.length === 0 ? (
        <EmptyState
          icon={Database}
          title="No data rooms yet"
          description="Create your first data room to start organizing and securely storing documents for your deal."
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Data Room
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {datarooms.map((dr) => (
            <DataroomCard
              key={dr.id}
              dataroom={dr}
              onOpen={() => openDataroom(dr.id, dr.name)}
              onRename={(name) => rename(dr.id, name)}
              onDelete={() => remove(dr.id)}
            />
          ))}
        </div>
      )}

      <CreateDataroomDialog
        open={createOpen}
        onConfirm={handleCreate}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
