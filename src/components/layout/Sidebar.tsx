import { useNavigationStore } from "@/store/navigationStore";
import { FolderTree } from "@/components/folder/FolderTree";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { dataroomId, dataroomName } = useNavigationStore();

  if (!dataroomId) return null;

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-background flex flex-col">
      <div className="flex items-center gap-2 px-3 py-3 border-b border-border">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 shrink-0">
          <svg className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
          </svg>
        </div>
        <span className="text-sm font-semibold truncate">{dataroomName}</span>
      </div>

      <ScrollArea className="flex-1 py-2">
        <FolderTree dataroomId={dataroomId} />
      </ScrollArea>

      <div className="border-t border-border px-3 py-2.5 text-xs text-muted-foreground">
        <span className={cn("inline-flex items-center gap-1.5")}>
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Stored locally
        </span>
      </div>
    </aside>
  );
}
