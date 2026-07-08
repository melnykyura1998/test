import { useCallback, useEffect, useState } from "react";
import type { Folder } from "@/types";
import {
  getFoldersInParent,
  getAllFoldersInDataroom,
  createFolder,
  updateFolderName,
  deleteFolder,
  getFolder,
} from "@/db/database";

/** Folders for the current explorer location (direct children only) */
export function useFolders(dataroomId: string | null, parentId: string | null) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!dataroomId) {
      setFolders([]);
      return;
    }
    setLoading(true);
    try {
      const result = await getFoldersInParent(dataroomId, parentId);
      setFolders(result);
    } finally {
      setLoading(false);
    }
  }, [dataroomId, parentId]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (name: string) => {
      if (!dataroomId) return;
      const f = await createFolder(dataroomId, parentId, name);
      await load();
      return f;
    },
    [dataroomId, parentId, load]
  );

  const rename = useCallback(
    async (id: string, name: string) => {
      await updateFolderName(id, name);
      await load();
    },
    [load]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteFolder(id);
      await load();
    },
    [load]
  );

  return { folders, loading, create, rename, remove, reload: load };
}

/** All folders in a dataroom (used for the sidebar tree) */
export function useAllFolders(dataroomId: string | null) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!dataroomId) {
      setFolders([]);
      return;
    }
    setLoading(true);
    try {
      const result = await getAllFoldersInDataroom(dataroomId);
      setFolders(result);
    } finally {
      setLoading(false);
    }
  }, [dataroomId]);

  useEffect(() => {
    load();
  }, [load]);

  return { folders, loading, reload: load };
}

export { getFolder };
