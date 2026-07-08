import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  children: React.ReactNode;
  className?: string;
}

export function DropZone({ onFiles, children, className }: DropZoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      const pdfs = accepted.filter((f) => f.type === "application/pdf");
      if (pdfs.length > 0) onFiles(pdfs);
    },
    [onFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn("relative", className)}
    >
      <input {...getInputProps()} />
      {children}

      {/* Drag overlay */}
      {isDragActive && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary bg-primary/5 backdrop-blur-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-3">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <p className="text-base font-semibold text-primary">Drop PDF files here</p>
          <p className="text-sm text-muted-foreground mt-1">Files will be added to this folder</p>
        </div>
      )}
    </div>
  );
}
