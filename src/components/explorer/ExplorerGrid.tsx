import { lazy, Suspense, useCallback, useRef, useState } from "react";
import { FolderPlus, Upload, Files, FolderOpen } from "lucide-react";
import { useNavigationStore } from "@/store/navigationStore";
import { useFolders } from "@/hooks/useFolders";
import { useFiles } from "@/hooks/useFiles";
import { searchFilesAndFolders } from "@/db/database";
import { FolderCard } from "./FolderCard";
import { FileCard } from "./FileCard";
import { DropZone } from "./DropZone";
import { CreateFolderDialog } from "@/components/folder/CreateFolderDialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import type { FileRecord, Folder } from "@/types";
import { useEffect } from "react";

const PDFViewerModal = lazy(() =>
  import("@/components/viewer/PDFViewerModal").then((m) => ({ default: m.PDFViewerModal }))
);

export function ExplorerGrid() {
  const { dataroomId, folderId, openFolder, viewMode, searchQuery } = useNavigationStore();

  const { folders, create: createFolder, rename: renameFolder, remove: removeFolder } =
    useFolders(dataroomId, folderId);
  const { files, upload, rename: renameFile, remove: removeFile } = useFiles(dataroomId, folderId);

  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileRecord | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search results
  const [searchFolders, setSearchFolders] = useState<Folder[]>([]);
  const [searchFiles, setSearchFiles] = useState<FileRecord[]>([]);

  useEffect(() => {
    if (!dataroomId || !searchQuery.trim()) {
      setSearchFolders([]);
      setSearchFiles([]);
      return;
    }
    searchFilesAndFolders(dataroomId, searchQuery).then(({ folders, files }) => {
      setSearchFolders(folders);
      setSearchFiles(files);
    });
  }, [dataroomId, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;
  const displayFolders = isSearching ? searchFolders : folders;
  const displayFiles = isSearching ? searchFiles : files;

  const handleFiles = useCallback(
    async (fileList: File[]) => {
      for (const f of fileList) {
        await upload(f);
      }
    },
    [upload]
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).filter(
      (f) => f.type === "application/pdf"
    );
    if (files.length) handleFiles(files);
    e.target.value = "";
  }

  async function handleCreateFolder(name: string) {
    await createFolder(name);
    setCreateFolderOpen(false);
  }

  const isEmpty = displayFolders.length === 0 && displayFiles.length === 0;

  return (
    <DropZone onFiles={handleFiles} className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-background shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCreateFolderOpen(true)}
        >
          <FolderPlus className="h-4 w-4" />
          New Folder
        </Button>
        <Button
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          Upload PDF
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />

        {isSearching && (
          <span className="ml-auto text-sm text-muted-foreground">
            {displayFolders.length + displayFiles.length} result
            {displayFolders.length + displayFiles.length !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-5">
        {isEmpty ? (
          isSearching ? (
            <EmptyState
              icon={Files}
              title="No results found"
              description={`No files or folders match "${searchQuery}".`}
            />
          ) : (
            <EmptyState
              icon={FolderOpen}
              title="This folder is empty"
              description="Upload PDF files or create folders to organise your documents."
              action={
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setCreateFolderOpen(true)}>
                    <FolderPlus className="h-4 w-4" /> New Folder
                  </Button>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4" /> Upload PDF
                  </Button>
                </div>
              }
            />
          )
        ) : (
          <>
            {/* Folders section */}
            {displayFolders.length > 0 && (
              <section className="mb-6">
                {!isSearching && (
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Folders
                  </h2>
                )}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {displayFolders.map((f) => (
                      <FolderCard
                        key={f.id}
                        folder={f}
                        viewMode="grid"
                        onOpen={() =>
                          openFolder({ id: f.id, name: f.name, type: "folder" })
                        }
                        onRename={(name) => renameFolder(f.id, name)}
                        onDelete={() => removeFolder(f.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-border divide-y divide-border overflow-hidden">
                    {displayFolders.map((f) => (
                      <FolderCard
                        key={f.id}
                        folder={f}
                        viewMode="list"
                        onOpen={() =>
                          openFolder({ id: f.id, name: f.name, type: "folder" })
                        }
                        onRename={(name) => renameFolder(f.id, name)}
                        onDelete={() => removeFolder(f.id)}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Files section */}
            {displayFiles.length > 0 && (
              <section>
                {!isSearching && (
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Files
                  </h2>
                )}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {displayFiles.map((f) => (
                      <FileCard
                        key={f.id}
                        file={f}
                        viewMode="grid"
                        onPreview={() => setPreviewFile(f)}
                        onRename={(name) => renameFile(f.id, name)}
                        onDelete={() => removeFile(f.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-border divide-y divide-border overflow-hidden">
                    {/* List header */}
                    <div className="flex items-center gap-3 px-4 py-2 bg-muted/50 text-xs font-medium text-muted-foreground">
                      <span className="w-5 shrink-0" />
                      <span className="flex-1">Name</span>
                      <span className="w-16 text-right">Size</span>
                      <span className="w-28 text-right">Date</span>
                      <span className="w-7 shrink-0" />
                    </div>
                    {displayFiles.map((f) => (
                      <FileCard
                        key={f.id}
                        file={f}
                        viewMode="list"
                        onPreview={() => setPreviewFile(f)}
                        onRename={(name) => renameFile(f.id, name)}
                        onDelete={() => removeFile(f.id)}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>

      {/* Dialogs */}
      <CreateFolderDialog
        open={createFolderOpen}
        onConfirm={handleCreateFolder}
        onClose={() => setCreateFolderOpen(false)}
      />

      {previewFile && (
        <Suspense fallback={null}>
          <PDFViewerModal
            file={previewFile}
            onClose={() => setPreviewFile(null)}
          />
        </Suspense>
      )}
    </DropZone>
  );
}
