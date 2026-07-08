import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2, FolderOpen } from "lucide-react";
import type { DataRoom } from "@/types";
import { formatDate } from "@/lib/utils";
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

interface DataroomCardProps {
  dataroom: DataRoom;
  onOpen: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
}

export function DataroomCard({ dataroom, onOpen, onRename, onDelete }: DataroomCardProps) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <div
        className="group relative flex flex-col rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer"
        onClick={onOpen}
      >
        {/* Icon */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
          </svg>
        </div>

        <h3 className="font-semibold text-sm leading-snug mb-1 pr-6 line-clamp-2">{dataroom.name}</h3>
        <p className="text-xs text-muted-foreground mt-auto pt-3">
          Created {formatDate(new Date(dataroom.createdAt))}
        </p>

        {/* Kebab menu */}
        <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onOpen}>
                <FolderOpen className="h-4 w-4" /> Open
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRenameOpen(true)}>
                <Pencil className="h-4 w-4" /> Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <RenameDialog
        open={renameOpen}
        title="Rename Data Room"
        currentName={dataroom.name}
        onConfirm={(name) => { onRename(name); setRenameOpen(false); }}
        onClose={() => setRenameOpen(false)}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        title="Delete Data Room"
        description={`"${dataroom.name}" and all its folders and files will be permanently deleted. This action cannot be undone.`}
        onConfirm={onDelete}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  );
}
