import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateDataroomDialogProps {
  open: boolean;
  /** Return an error string to show inline, or void/undefined on success. */
  onConfirm: (name: string) => Promise<string | void>;
  onClose: () => void;
}

export function CreateDataroomDialog({ open, onConfirm, onClose }: CreateDataroomDialogProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setValue("");
      setError("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    setLoading(true);
    setError("");
    try {
      const err = await onConfirm(trimmed);
      if (err) {
        setError(err);
      } else {
        setValue("");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Data Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-2 space-y-1.5">
            <Input
              ref={inputRef}
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(""); }}
              placeholder="Data room name…"
              className={error ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!value.trim() || loading}>
              {loading ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
