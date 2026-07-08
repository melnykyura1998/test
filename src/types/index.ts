export interface DataRoom {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder {
  id: string;
  dataroomId: string;
  /** null means the folder is at the root of the dataroom */
  parentId: string | null;
  name: string;
  /**
   * Ordered list of ancestor folder IDs from root → immediate parent.
   * Used for O(1) subtree queries and breadcrumb reconstruction.
   */
  path: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FileRecord {
  id: string;
  dataroomId: string;
  /** null means the file is at the root of the dataroom */
  folderId: string | null;
  /** Display name — can be changed by the user */
  name: string;
  /** Original filename from the upload */
  originalName: string;
  size: number;
  mimeType: string;
  /** The actual file stored as a Blob in IndexedDB */
  blob: Blob;
  createdAt: Date;
  updatedAt: Date;
}

/** Union type for items shown in the explorer grid */
export type ExplorerItem =
  | ({ kind: "folder" } & Folder)
  | ({ kind: "file" } & FileRecord);

export type ViewMode = "grid" | "list";

export interface NavigationState {
  dataroomId: string | null;
  folderId: string | null;
  /** Full breadcrumb path: [{id, name}] from dataroom root to current folder */
  breadcrumb: BreadcrumbEntry[];
}

export interface BreadcrumbEntry {
  id: string | null;
  name: string;
  type: "dataroom" | "folder";
}
