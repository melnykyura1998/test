import { useCallback, useEffect, useState } from "react";
import type { DataRoom } from "@/types";
import {
  getAllDataRooms,
  createDataRoom,
  updateDataRoomName,
  deleteDataRoom,
} from "@/db/database";

export function useDatarooms() {
  const [datarooms, setDatarooms] = useState<DataRoom[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all = await getAllDataRooms();
      setDatarooms(all);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (name: string) => {
      const dr = await createDataRoom(name);
      await load();
      return dr;
    },
    [load]
  );

  const rename = useCallback(
    async (id: string, name: string) => {
      await updateDataRoomName(id, name);
      await load();
    },
    [load]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteDataRoom(id);
      await load();
    },
    [load]
  );

  return { datarooms, loading, create, rename, remove, reload: load };
}
