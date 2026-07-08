import { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download } from "lucide-react";
import type { FileRecord } from "@/types";
import { Button } from "@/components/ui/button";

interface PDFViewerModalProps {
  file: FileRecord;
  onClose: () => void;
}

export function PDFViewerModal({ file, onClose }: PDFViewerModalProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrentPage((p) => Math.max(1, p - 1));
      if (e.key === "ArrowRight") setCurrentPage((p) => Math.min(numPages, p + 1));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, numPages]);

  function onDocumentLoad({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setCurrentPage(1);
  }

  function handleDownload() {
    const url = URL.createObjectURL(file.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.endsWith(".pdf") ? file.name : `${file.name}.pdf`;
    a.click();
    // Revoke shortly after to free memory
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90" onClick={onClose}>
      {/* Toolbar */}
      <div
        className="flex items-center gap-2 px-4 py-2 bg-black/80 border-b border-white/10 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="flex-1 text-sm font-medium text-white truncate">{file.name}</span>

        {numPages > 0 && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-white hover:bg-white/10"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-white/70 min-w-[4rem] text-center">
              {currentPage} / {numPages}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-white hover:bg-white/10"
              onClick={() => setCurrentPage((p) => Math.min(numPages, p + 1))}
              disabled={currentPage >= numPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="h-4 w-px bg-white/20" />

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-white hover:bg-white/10"
            onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-white/70 min-w-[3rem] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-white hover:bg-white/10"
            onClick={() => setScale((s) => Math.min(3, s + 0.25))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-4 w-px bg-white/20" />

        <Button
          variant="ghost"
          size="icon-sm"
          className="text-white hover:bg-white/10"
          onClick={() => setRotation((r) => (r + 90) % 360)}
        >
          <RotateCw className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          className="text-white hover:bg-white/10"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
        </Button>

        <div className="h-4 w-px bg-white/20" />

        <Button
          variant="ghost"
          size="icon-sm"
          className="text-white hover:bg-white/10"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* PDF content */}
      <div
        className="flex-1 overflow-auto flex items-start justify-center p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <Document
          file={file.blob}
          onLoadSuccess={onDocumentLoad}
          loading={
            <div className="flex items-center justify-center h-64 w-full">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center h-64 text-white/60 gap-2">
              <p className="text-sm">Failed to load PDF.</p>
              <p className="text-xs opacity-60">Make sure the file is a valid PDF.</p>
            </div>
          }
        >
          <Page
            pageNumber={currentPage}
            scale={scale}
            rotate={rotation}
            className="shadow-2xl"
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
    </div>
  );
}
