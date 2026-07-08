import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import type { DataRoom } from "@/types";
import {
  getAllDataRooms,
  createDataRoom,
  updateDataRoomName,
  deleteDataRoom,
} from "@/db/database";

export function useDatarooms() {
  const { user } = useUser();
  const userId = user?.id ?? null;

  const [datarooms, setDatarooms] = useState<DataRoom[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!userId) {
      setDatarooms([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const all = await getAllDataRooms(userId);
      setDatarooms(all);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (name: string) => {
      if (!userId) return;
      const dr = await createDataRoom(userId, name);
      await load();
      return dr;
    },
    [userId, load]
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
