"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowUp, ArrowDown, X } from "lucide-react";
import { mergePdfs } from "@/lib/pdf/merge";
import { downloadBytes } from "@/lib/download";
import { Button } from "@/components/ui/Button";
import { dropzoneClass } from "@/lib/ui";

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
      <div {...getRootProps()} className={`min-h-40 ${dropzoneClass(isDragActive)}`}>
        <input {...getInputProps()} />
        <p className="font-medium">Arraste dois ou mais PDFs aqui, ou clique para selecionar</p>
        <p className="text-sm text-muted">Os arquivos não saem do seu navegador.</p>
      </div>

      {files.length > 0 && (
        <ul className="flex flex-col gap-2">
          {files.map((entry, index) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-2"
            >
              <span className="truncate text-sm">
                {index + 1}. {entry.file.name}
              </span>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => moveFile(index, -1)}
                  disabled={index === 0}
                  className="rounded p-1.5 text-muted hover:bg-brand-soft hover:text-brand disabled:opacity-30"
                  aria-label="Mover para cima"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveFile(index, 1)}
                  disabled={index === files.length - 1}
                  className="rounded p-1.5 text-muted hover:bg-brand-soft hover:text-brand disabled:opacity-30"
                  aria-label="Mover para baixo"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeFile(entry.id)}
                  className="rounded p-1.5 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  aria-label="Remover arquivo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Button
        type="button"
        onClick={handleMerge}
        disabled={files.length < 2 || isMerging}
        className="self-end"
      >
        {isMerging ? "Mesclando…" : "Mesclar e baixar"}
      </Button>
    </div>
  );
}
