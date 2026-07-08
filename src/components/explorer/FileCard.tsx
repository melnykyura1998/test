import { useState } from "react";
import { FileText, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import type { FileRecord } from "@/types";
import { formatBytes, formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { RenameDialog } from "@/components/shared/RenameDialog";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { cn } from "@/lib/utils";

interface FileCardProps {
  file: FileRecord;
  viewMode: "grid" | "list";
  onPreview: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}

export function FileCard({ file, viewMode, onPreview, onRename, onDelete }: FileCardProps) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const menu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn(
            "h-7 w-7 transition-opacity",
            viewMode === "grid" ? "opacity-0 group-hover:opacity-100" : ""
          )}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onPreview(); }}>
          <Eye className="h-4 w-4" /> Preview
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setRenameOpen(true); }}>
          <Pencil className="h-4 w-4" /> Rename
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={(e) => { e.stopPropagation(); setDeleteOpen(true); }}
        >
          <Trash2 className="h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (viewMode === "list") {
    return (
      <>
        <div
          className="group flex items-center gap-3 px-4 py-2.5 hover:bg-accent rounded-lg cursor-pointer transition-colors"
          onClick={onPreview}
        >
          <FileText className="h-5 w-5 text-blue-500 shrink-0" />
          <span className="flex-1 text-sm truncate">{file.name}</span>
          <span className="text-xs text-muted-foreground shrink-0 w-16 text-right">{formatBytes(file.size)}</span>
          <span className="text-xs text-muted-foreground shrink-0 w-28 text-right">{formatDate(new Date(file.createdAt))}</span>
          <div onClick={(e) => e.stopPropagation()}>{menu}</div>
        </div>
        <RenameDialog open={renameOpen} title="Rename File" currentName={file.name} onConfirm={(n) => { onRename(n); setRenameOpen(false); }} onClose={() => setRenameOpen(false)} />
        <DeleteConfirmDialog open={deleteOpen} title="Delete File" description={`"${file.name}" will be permanently deleted.`} onConfirm={onDelete} onClose={() => setDeleteOpen(false)} />
      </>
    );
  }

  return (
    <>
      <div
        className="group relative flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer text-center"
        onClick={onPreview}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50">
          <FileText className="h-8 w-8 text-blue-500" />
        </div>
        <span className="text-sm font-medium leading-snug line-clamp-2 w-full">{file.name}</span>
        <span className="text-xs text-muted-foreground">{formatBytes(file.size)}</span>

        <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
          {menu}
        </div>
      </div>
      <RenameDialog open={renameOpen} title="Rename File" currentName={file.name} onConfirm={(n) => { onRename(n); setRenameOpen(false); }} onClose={() => setRenameOpen(false)} />
      <DeleteConfirmDialog open={deleteOpen} title="Delete File" description={`"${file.name}" will be permanently deleted.`} onConfirm={onDelete} onClose={() => setDeleteOpen(false)} />
    </>
  );
}
