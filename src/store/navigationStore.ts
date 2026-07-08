import { create } from "zustand";
import type { BreadcrumbEntry, ViewMode } from "@/types";

interface NavigationStore {
  // Current location
  dataroomId: string | null;
  dataroomName: string | null;
  folderId: string | null;
  breadcrumb: BreadcrumbEntry[];

  // UI state
  viewMode: ViewMode;
  searchQuery: string;

  // Actions
  openDataroom: (id: string, name: string) => void;
  openFolder: (entry: BreadcrumbEntry) => void;
  navigateToBreadcrumb: (index: number) => void;
  goHome: () => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (q: string) => void;
  updateDataroomName: (name: string) => void;
}

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  dataroomId: null,
  dataroomName: null,
  folderId: null,
  breadcrumb: [],
  viewMode: "grid",
  searchQuery: "",

  openDataroom(id, name) {
    set({
      dataroomId: id,
      dataroomName: name,
      folderId: null,
      breadcrumb: [{ id: null, name, type: "dataroom" }],
      searchQuery: "",
    });
  },

  openFolder(entry) {
    set((state) => ({
      folderId: entry.id,
      breadcrumb: [...state.breadcrumb, entry],
      searchQuery: "",
    }));
  },

  navigateToBreadcrumb(index) {
    const { breadcrumb } = get();
    const entry = breadcrumb[index];
    if (!entry) return;
    const newBreadcrumb = breadcrumb.slice(0, index + 1);
    if (entry.type === "dataroom") {
      set({ folderId: null, breadcrumb: newBreadcrumb, searchQuery: "" });
    } else {
      set({ folderId: entry.id, breadcrumb: newBreadcrumb, searchQuery: "" });
    }
  },

  goHome() {
    set({
      dataroomId: null,
      dataroomName: null,
      folderId: null,
      breadcrumb: [],
      searchQuery: "",
    });
  },

  setViewMode(mode) {
    set({ viewMode: mode });
  },

  setSearchQuery(q) {
    set({ searchQuery: q });
  },

  updateDataroomName(name) {
    set((state) => ({
      dataroomName: name,
      breadcrumb: state.breadcrumb.map((b, i) =>
        i === 0 && b.type === "dataroom" ? { ...b, name } : b
      ),
    }));
  },
}));
