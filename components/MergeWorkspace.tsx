"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { mergePdfs } from "@/lib/pdf/merge";
import { downloadBytes } from "@/lib/download";

type MergeFile = { id: string; file: File };

export function MergeWorkspace() {
  const [files, setFiles] = useState<MergeFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((current) => [
      ...current,
      ...acceptedFiles.map((file) => ({ id: crypto.randomUUID(), file })),
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
  });

  const moveFile = (index: number, direction: -1 | 1) => {
    setFiles((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const removeFile = (id: string) => {
    setFiles((current) => current.filter((entry) => entry.id !== id));
  };

  const handleMerge = async () => {
    setIsMerging(true);
    try {
      const byteArrays = await Promise.all(files.map((entry) => entry.file.arrayBuffer()));
      const merged = await mergePdfs(byteArrays);
      downloadBytes(merged, "mesclado.pdf");
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        {...getRootProps()}
        className={`flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive
            ? "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-900"
            : "border-zinc-300 dark:border-zinc-700"
        }`}
      >
        <input {...getInputProps()} />
        <p className="font-medium">Arraste dois ou mais PDFs aqui, ou clique para selecionar</p>
        <p className="text-sm text-zinc-500">Os arquivos não saem do seu navegador.</p>
      </div>

      {files.length > 0 && (
        <ul className="flex flex-col gap-2">
          {files.map((entry, index) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 px-4 py-2 dark:border-zinc-700"
            >
              <span className="truncate text-sm">
                {index + 1}. {entry.file.name}
              </span>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => moveFile(index, -1)}
                  disabled={index === 0}
                  className="rounded px-2 py-1 text-sm hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
                  aria-label="Mover para cima"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveFile(index, 1)}
                  disabled={index === files.length - 1}
                  className="rounded px-2 py-1 text-sm hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
                  aria-label="Mover para baixo"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeFile(entry.id)}
                  className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  aria-label="Remover arquivo"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={handleMerge}
        disabled={files.length < 2 || isMerging}
        className="self-end rounded-lg bg-zinc-900 px-5 py-2.5 font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {isMerging ? "Mesclando…" : "Mesclar e baixar"}
      </button>
    </div>
  );
}
