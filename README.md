# Vault — Data Room MVP

A polished, fully client-side Data Room SPA for secure document organisation and due diligence workflows.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Tech Stack

| Concern | Library |
|---|---|
| Framework | Vite + React 19 + TypeScript |
| Styling | Tailwind CSS v3 + shadcn/ui primitives |
| Persistence | Dexie.js (IndexedDB wrapper) |
| Global state | Zustand |
| File upload | react-dropzone |
| PDF viewer | react-pdf (pdfjs-dist) |
| Icons | lucide-react |

---

## Features

- **Multiple Data Rooms** — create, rename, delete; each is an independent vault
- **Nested Folders** — unlimited folder depth; create, rename, recursive delete via sidebar tree and explorer
- **PDF Upload** — button click or drag-and-drop onto any folder; PDF-only enforced
- **Duplicate handling** — files and folders with conflicting names are auto-suffixed (`report (1).pdf`)
- **PDF Preview** — full in-app viewer with page navigation, zoom (50–300%), rotation, and download
- **Search** — real-time search across file and folder names within a data room
- **Grid / List view** — toggle between card grid and compact list
- **Persistent storage** — all metadata and file blobs stored in the browser's IndexedDB; survives page reloads
- **Keyboard shortcuts** — Escape to close PDF viewer; arrow keys to page through

---

## Design Decisions

### IndexedDB via Dexie.js instead of localStorage

PDF blobs can easily reach tens of megabytes. `localStorage` is synchronous, string-only, and capped at ~5 MB. IndexedDB is async, handles binary data natively, and has a much higher quota. Dexie.js provides a clean Promise-based API on top and enables multi-index queries that would be impossible with `localStorage`.

### `path[]` array on Folder records

Each `Folder` stores an ordered array of all ancestor IDs (`path`). This single field enables:

- **O(n) subtree deletion** — `WHERE path CONTAINS folderId` fetches all descendants in one IndexedDB query, no recursive round-trips
- **Breadcrumb reconstruction** — the full ancestry is stored at write-time, making read-time breadcrumb O(1)

The trade-off is a slightly larger write (updating `path` on creation) but reads — which happen on every navigation — are much cheaper.

### Zustand for navigation state

The current dataroom/folder and breadcrumb live in a single Zustand store. This avoids prop-drilling through the component tree (Header → Breadcrumb, Sidebar → FolderTree → FolderTreeItem all need the same navigation context) without the boilerplate of React Context + useReducer.

### Hooks as the data layer

`useDatarooms`, `useFolders`, `useFiles` each encapsulate IndexedDB queries and expose typed `create / rename / remove` actions alongside a loading flag. Components stay thin and only deal with rendering. This mirrors a React Query pattern without adding the dependency.

### Lazy-loaded PDF viewer

`react-pdf` bundles pdfjs-dist which is ~1 MB. It's only loaded when the user actually opens a file, using React `lazy()` + `Suspense`. This keeps the initial page load fast.

### Duplicate name strategy — auto-suffix

When a file or folder with a conflicting name is created, the app appends ` (1)`, ` (2)`, etc. to the display name. The alternative (showing an error) causes friction in bulk-upload scenarios. The original filename is always preserved in `originalName` for reference.

---

## Project Structure

```
src/
├── components/
│   ├── layout/        AppLayout, Header, Sidebar, Breadcrumb
│   ├── dataroom/      DataroomList, DataroomCard, CreateDataroomDialog
│   ├── folder/        FolderTree, FolderTreeItem, CreateFolderDialog
│   ├── explorer/      ExplorerGrid, FolderCard, FileCard, DropZone
│   ├── viewer/        PDFViewerModal
│   ├── shared/        RenameDialog, DeleteConfirmDialog, EmptyState
│   └── ui/            Button, Dialog, DropdownMenu, AlertDialog, Input, …
├── db/
│   └── database.ts    Dexie schema + all CRUD operations
├── store/
│   └── navigationStore.ts  Zustand navigation + view state
├── hooks/
│   ├── useDatarooms.ts
│   ├── useFolders.ts
│   └── useFiles.ts
├── types/
│   └── index.ts       Shared TypeScript interfaces
└── lib/
    └── utils.ts       cn, formatBytes, formatDate, getUniqueName
```

---

## Data Model

```typescript
interface DataRoom { id, name, createdAt, updatedAt }

interface Folder {
  id, dataroomId,
  parentId: string | null,   // null = root
  name,
  path: string[],            // ancestor IDs, root → parent
  createdAt, updatedAt
}

interface FileRecord {
  id, dataroomId,
  folderId: string | null,   // null = root
  name,                      // display name (mutable)
  originalName,              // original upload filename
  size, mimeType,
  blob: Blob,                // stored in IndexedDB
  createdAt, updatedAt
}
```

---

## Optional Extras (not implemented in MVP, clear extension points)

- **Deploy** — `npm run build` produces a static `dist/` folder deployable to Vercel in one click
- **Auth** — add Supabase Auth in front of the `AppLayout` component; swap the Dexie layer for Supabase Storage + Postgres
- **Full-text search** — index PDF text with pdfjs-dist `getTextContent` at upload time and store in a separate Dexie table
