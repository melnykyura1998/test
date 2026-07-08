import { useCallback, useEffect, useState } from "react";
import type { FileRecord } from "@/types";
import {
  getFilesInFolder,
  uploadFile,
  updateFileName,
  deleteFile,
} from "@/db/database";

export function useFiles(dataroomId: string | null, folderId: string | null) {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!dataroomId) {
      setFiles([]);
      return;
    }
    setLoading(true);
    try {
      const result = await getFilesInFolder(dataroomId, folderId);
      setFiles(result);
    } finally {
      setLoading(false);
    }
  }, [dataroomId, folderId]);

  useEffect(() => {
    load();
  }, [load]);

  const upload = useCallback(
    async (file: File) => {
      if (!dataroomId) return;
      const record = await uploadFile(dataroomId, folderId, file);
      await load();
      return record;
    },
    [dataroomId, folderId, load]
  );

  const rename = useCallback(
    async (id: string, name: string) => {
      await updateFileName(id, name);
      await load();
    },
    [load]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteFile(id);
      await load();
    },
    [load]
  );

  return { files, loading, upload, rename, remove, reload: load };
}
