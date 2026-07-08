import { useState } from "react";
import { Plus } from "lucide-react";
import { useFolders } from "@/hooks/useFolders";
import { useNavigationStore } from "@/store/navigationStore";
import { FolderTreeItem } from "./FolderTreeItem";
import { CreateFolderDialog } from "./CreateFolderDialog";

interface FolderTreeProps {
  dataroomId: string;
}

export function FolderTree({ dataroomId }: FolderTreeProps) {
  const { folderId, navigateToBreadcrumb } = useNavigationStore();
  const { folders, create } = useFolders(dataroomId, null);
  const [createOpen, setCreateOpen] = useState(false);

  const isRootActive = folderId === null;

  async function handleCreate(name: string) {
    await create(name);
    setCreateOpen(false);
  }

  return (
    <div className="px-2">
      {/* Root entry */}
      <button
        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
          isRootActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        }`}
        onClick={() => navigateToBreadcrumb(0)}
      >
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
        </svg>
        <span className="truncate">Root</span>
      </button>

      {/* Folders */}
      <div className="mt-1">
        {folders.map((f) => (
          <FolderTreeItem
            key={f.id}
            folder={f}
            depth={0}
            dataroomId={dataroomId}
          />
        ))}
      </div>

      {/* New folder button */}
      <button
        className="mt-1 flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        onClick={() => setCreateOpen(true)}
      >
        <Plus className="h-3.5 w-3.5" />
        New folder
      </button>

      <CreateFolderDialog
        open={createOpen}
        onConfirm={handleCreate}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
