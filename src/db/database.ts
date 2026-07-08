import Dexie, { type Table } from "dexie";
import type { DataRoom, Folder, FileRecord } from "@/types";
import { generateId, getUniqueName } from "@/lib/utils";

class DataRoomDatabase extends Dexie {
  datarooms!: Table<DataRoom, string>;
  folders!: Table<Folder, string>;
  files!: Table<FileRecord, string>;

  constructor() {
    super("DataRoomDB");
    this.version(1).stores({
      datarooms: "id, name, createdAt",
      folders: "id, dataroomId, parentId, createdAt, *path",
      files: "id, dataroomId, folderId, name, createdAt",
    });
    // Version 2: add userId index to datarooms for per-user scoping
    this.version(2).stores({
      datarooms: "id, userId, name, createdAt",
      folders: "id, dataroomId, parentId, createdAt, *path",
      files: "id, dataroomId, folderId, name, createdAt",
    });
  }
}

const db = new DataRoomDatabase();
export default db;

// ─── DataRoom operations ────────────────────────────────────────────────────

export async function createDataRoom(userId: string, name: string): Promise<DataRoom> {
  const trimmed = name.trim();
  const existing = await db.datarooms
    .where("userId")
    .equals(userId)
    .filter((dr) => dr.name === trimmed)
    .first();
  if (existing) {
    throw new Error(`A data room named "${trimmed}" already exists.`);
  }
  const now = new Date();
  const record: DataRoom = { id: generateId(), userId, name: trimmed, createdAt: now, updatedAt: now };
  await db.datarooms.add(record);
  return record;
}

export async function getAllDataRooms(userId: string): Promise<DataRoom[]> {
  return db.datarooms
    .where("userId")
    .equals(userId)
    .reverse()
    .sortBy("createdAt")
    .then((rows) => rows.reverse());
}

export async function updateDataRoomName(id: string, name: string): Promise<void> {
  await db.datarooms.update(id, { name: name.trim(), updatedAt: new Date() });
}

export async function deleteDataRoom(id: string): Promise<void> {
  // Delete all nested folders and files
  const folderIds = await db.folders
    .where("dataroomId")
    .equals(id)
    .primaryKeys();
  await db.files.where("dataroomId").equals(id).delete();
  await db.folders.bulkDelete(folderIds);
  await db.datarooms.delete(id);
}

// ─── Folder operations ───────────────────────────────────────────────────────

export async function createFolder(
  dataroomId: string,
  parentId: string | null,
  name: string
): Promise<Folder> {
  // Build path from parent
  let path: string[] = [];
  if (parentId) {
    const parent = await db.folders.get(parentId);
    if (parent) path = [...parent.path, parentId];
  }

  // Ensure unique name among siblings
  // Note: IndexedDB can't use null as a compound key, so filter in JS
  const siblings = await db.folders
    .where("dataroomId")
    .equals(dataroomId)
    .filter((f) => f.parentId === parentId)
    .toArray();
  const siblingNames = siblings.map((f) => f.name);
  const uniqueName = getUniqueName(name.trim(), siblingNames);

  const now = new Date();
  const record: Folder = {
    id: generateId(),
    dataroomId,
    parentId,
    name: uniqueName,
    path,
    createdAt: now,
    updatedAt: now,
  };
  await db.folders.add(record);
  return record;
}

export async function getFoldersInParent(
  dataroomId: string,
  parentId: string | null
): Promise<Folder[]> {
  const all = await db.folders
    .where("dataroomId")
    .equals(dataroomId)
    .filter((f) => f.parentId === parentId)
    .toArray();
  return all.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getFolder(id: string): Promise<Folder | undefined> {
  return db.folders.get(id);
}

export async function updateFolderName(id: string, name: string): Promise<void> {
  await db.folders.update(id, { name: name.trim(), updatedAt: new Date() });
}

/**
 * Deletes a folder and ALL descendant folders and files.
 * Uses the `path` index: any folder whose path array contains `id` is a descendant.
 */
export async function deleteFolder(id: string): Promise<void> {
  // Collect descendant folder ids
  const descendants = await db.folders.where("path").equals(id).toArray();
  const allFolderIds = [id, ...descendants.map((f) => f.id)];

  // Delete files in all those folders
  await db.files.where("folderId").anyOf(allFolderIds).delete();

  // Delete the folders themselves
  await db.folders.bulkDelete(allFolderIds);
}

export async function getAllFoldersInDataroom(dataroomId: string): Promise<Folder[]> {
  return db.folders.where("dataroomId").equals(dataroomId).sortBy("name");
}

// ─── File operations ─────────────────────────────────────────────────────────

export async function uploadFile(
  dataroomId: string,
  folderId: string | null,
  file: File
): Promise<FileRecord> {
  // Ensure unique display name among siblings
  // Note: IndexedDB can't use null as a compound key, so filter in JS
  const siblings = await db.files
    .where("dataroomId")
    .equals(dataroomId)
    .filter((f) => f.folderId === folderId)
    .toArray();
  const siblingNames = siblings.map((f) => f.name);
  const uniqueName = getUniqueName(file.name, siblingNames);

  const now = new Date();
  const record: FileRecord = {
    id: generateId(),
    dataroomId,
    folderId,
    name: uniqueName,
    originalName: file.name,
    size: file.size,
    mimeType: file.type,
    blob: file,
    createdAt: now,
    updatedAt: now,
  };
  await db.files.add(record);
  return record;
}

export async function getFilesInFolder(
  dataroomId: string,
  folderId: string | null
): Promise<FileRecord[]> {
  const all = await db.files
    .where("dataroomId")
    .equals(dataroomId)
    .filter((f) => f.folderId === folderId)
    .toArray();
  return all.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getFile(id: string): Promise<FileRecord | undefined> {
  return db.files.get(id);
}

export async function updateFileName(id: string, name: string): Promise<void> {
  await db.files.update(id, { name: name.trim(), updatedAt: new Date() });
}

export async function deleteFile(id: string): Promise<void> {
  await db.files.delete(id);
}

export async function searchFilesAndFolders(
  dataroomId: string,
  query: string
): Promise<{ folders: Folder[]; files: FileRecord[] }> {
  const q = query.toLowerCase();
  const [folders, files] = await Promise.all([
    db.folders
      .where("dataroomId")
      .equals(dataroomId)
      .filter((f) => f.name.toLowerCase().includes(q))
      .toArray(),
    db.files
      .where("dataroomId")
      .equals(dataroomId)
      .filter((f) => f.name.toLowerCase().includes(q))
      .toArray(),
  ]);
  return { folders, files };
}
