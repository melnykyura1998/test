import { useState } from "react";
import { ChevronRight, Folder, FolderOpen, MoreHorizontal, Plus, Pencil, Trash2 } from "lucide-react";
import type { Folder as FolderType } from "@/types";
import { useNavigationStore } from "@/store/navigationStore";
import { useFolders } from "@/hooks/useFolders";
import { cn } from "@/lib/utils";
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
import { CreateFolderDialog } from "./CreateFolderDialog";

interface FolderTreeItemProps {
  folder: FolderType;
  depth: number;
  dataroomId: string;
}

export function FolderTreeItem({ folder, depth, dataroomId }: FolderTreeItemProps) {
  const { folderId, openFolder, navigateToBreadcrumb, breadcrumb } = useNavigationStore();
  const [expanded, setExpanded] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const { folders: children, create, rename, remove } = useFolders(dataroomId, folder.id);

  const isActive = folderId === folder.id;

  function handleClick() {
    setExpanded((p) => !p);
    // Build breadcrumb entry
    openFolder({ id: folder.id, name: folder.name, type: "folder" });
  }

  // If this folder is in the breadcrumb but we're navigating away, expand it
  const isAncestor = breadcrumb.some((b) => b.id === folder.id);

  async function handleCreate(name: string) {
    await create(name);
    setExpanded(true);
    setCreateOpen(false);
  }

  async function handleRename(name: string) {
    await rename(folder.id, name);
    // Update breadcrumb if this folder is in it
    const idx = breadcrumb.findIndex((b) => b.id === folder.id);
    if (idx >= 0) navigateToBreadcrumb(idx);
    setRenameOpen(false);
  }

  return (
    <>
      <div className={cn("group flex items-center", depth > 0 && "pl-3")}>
        <button
          className={cn(
            "flex flex-1 items-center gap-1.5 rounded-md px-2 py-1.5 text-sm transition-colors min-w-0",
            isActive
              ? "bg-primary/10 text-primary font-medium"
              : "text-foreground hover:bg-accent",
            isAncestor && !isActive && "font-medium"
          )}
          onClick={handleClick}
        >
          <span className="shrink-0 text-muted-foreground">
            {children.length > 0 || expanded ? (
              <ChevronRight
                className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-90")}
              />
            ) : (
              <span className="h-3.5 w-3.5 inline-block" />
            )}
          </span>
          {isActive ? (
            <FolderOpen className="h-4 w-4 shrink-0 text-primary" />
          ) : (
            <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <span className="truncate">{folder.name}</span>
        </button>

        {/* Inline actions */}
        <div className="flex items-center opacity-0 group-hover:opacity-100 pr-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="h-6 w-6">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" /> New subfolder
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

      {/* Children */}
      {expanded && children.length > 0 && (
        <div className="ml-2 border-l border-border pl-1">
          {children.map((child) => (
            <FolderTreeItem
              key={child.id}
              folder={child}
              depth={depth + 1}
              dataroomId={dataroomId}
            />
          ))}
        </div>
      )}

      <CreateFolderDialog
        open={createOpen}
        onConfirm={handleCreate}
        onClose={() => setCreateOpen(false)}
      />
      <RenameDialog
        open={renameOpen}
        title="Rename Folder"
        currentName={folder.name}
        onConfirm={handleRename}
        onClose={() => setRenameOpen(false)}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        title="Delete Folder"
        description={`"${folder.name}" and all its contents will be permanently deleted. This action cannot be undone.`}
        onConfirm={() => remove(folder.id)}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  );
}
