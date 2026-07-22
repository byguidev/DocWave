"use client";

import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";
import { usePdfStore } from "@/store/pdfStore";
import { dropzoneClass } from "@/lib/ui";
import { PageThumbnail } from "./PageThumbnail";

export function PdfWorkspace() {
  const { fileName, pages, isLoading, error, loadFile, reorderPages, rotatePage, removePage, reset } =
    usePdfStore();
  const dragIndex = useRef<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) void loadFile(file);
    },
    [loadFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  if (!fileName) {
    return (
      <div {...getRootProps()} className={`min-h-64 ${dropzoneClass(isDragActive)}`}>
        <input {...getInputProps()} />
        <UploadCloud className="h-8 w-8 text-brand" strokeWidth={1.75} />
        <p className="font-medium">Arraste um PDF aqui ou clique para selecionar</p>
        <p className="text-sm text-muted">O arquivo não sai do seu navegador.</p>
        {isLoading && <p className="text-sm text-muted">Carregando páginas…</p>}
        {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">
          {fileName} · {pages.length} página{pages.length === 1 ? "" : "s"}
        </span>
        <button
          type="button"
          onClick={reset}
          className="text-sm text-brand underline-offset-2 hover:underline"
        >
          Trocar arquivo
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {pages.map((page, index) => (
          <PageThumbnail
            key={page.id}
            page={page}
            index={index}
            onDragStart={(i) => {
              dragIndex.current = i;
            }}
            onDragOver={(i) => setOverIndex(i)}
            onDrop={() => {
              if (dragIndex.current !== null && overIndex !== null && dragIndex.current !== overIndex) {
                reorderPages(dragIndex.current, overIndex);
              }
              dragIndex.current = null;
              setOverIndex(null);
            }}
            onRotate={rotatePage}
            onRemove={removePage}
          />
        ))}
      </div>
    </div>
  );
}
