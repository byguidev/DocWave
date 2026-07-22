"use client";

import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { usePdfStore } from "@/store/pdfStore";
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
      <div
        {...getRootProps()}
        className={`flex min-h-64 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
          isDragActive
            ? "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-900"
            : "border-zinc-300 dark:border-zinc-700"
        }`}
      >
        <input {...getInputProps()} />
        <p className="font-medium">Arraste um PDF aqui ou clique para selecionar</p>
        <p className="text-sm text-zinc-500">O arquivo não sai do seu navegador.</p>
        {isLoading && <p className="text-sm text-zinc-500">Carregando páginas…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {fileName} · {pages.length} página{pages.length === 1 ? "" : "s"}
        </span>
        <button
          type="button"
          onClick={reset}
          className="text-sm text-zinc-500 underline hover:text-zinc-900 dark:hover:text-zinc-100"
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
