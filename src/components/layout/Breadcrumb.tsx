import { ChevronRight, Home } from "lucide-react";
import { useNavigationStore } from "@/store/navigationStore";
import { cn } from "@/lib/utils";

export function Breadcrumb() {
  const { breadcrumb, navigateToBreadcrumb, goHome, dataroomId } = useNavigationStore();

  if (!dataroomId) return null;

  return (
    <nav className="flex items-center gap-1 text-sm min-w-0">
      <button
        onClick={goHome}
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors shrink-0"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="sr-only">Home</span>
      </button>

      {breadcrumb.map((entry, i) => (
        <span key={`${entry.id}-${i}`} className="flex items-center gap-1 min-w-0">
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <button
            onClick={() => navigateToBreadcrumb(i)}
            className={cn(
              "truncate max-w-[180px] transition-colors",
              i === breadcrumb.length - 1
                ? "text-foreground font-medium cursor-default"
                : "text-muted-foreground hover:text-foreground"
            )}
            disabled={i === breadcrumb.length - 1}
          >
            {entry.name}
          </button>
        </span>
      ))}
    </nav>
  );
}
