import { LayoutGrid, List, Search, X } from "lucide-react";
import { Breadcrumb } from "./Breadcrumb";
import { Input } from "@/components/ui/input";
import { useNavigationStore } from "@/store/navigationStore";
import { cn } from "@/lib/utils";

export function Header() {
  const { dataroomId, viewMode, setViewMode, searchQuery, setSearchQuery } =
    useNavigationStore();

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
          <svg className="h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
          </svg>
        </div>
        <span className="font-semibold text-sm tracking-tight">Vault</span>
      </div>

      <div className="h-5 w-px bg-border shrink-0" />

      {/* Breadcrumb or home title */}
      <div className="flex-1 min-w-0">
        {dataroomId ? (
          <Breadcrumb />
        ) : (
          <span className="text-sm font-medium text-muted-foreground">All Data Rooms</span>
        )}
      </div>

      {/* Search (inside dataroom only) */}
      {dataroomId && (
        <div className="relative w-56 shrink-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            className="pl-8 h-8 text-xs"
            placeholder="Search files & folders…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      {/* View toggle */}
      {dataroomId && (
        <div className="flex items-center rounded-md border border-border p-0.5 shrink-0">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "flex items-center justify-center h-6 w-6 rounded transition-colors",
              viewMode === "grid"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "flex items-center justify-center h-6 w-6 rounded transition-colors",
              viewMode === "list"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </header>
  );
}
