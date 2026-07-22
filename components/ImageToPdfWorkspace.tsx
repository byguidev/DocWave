"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { imagesToPdf } from "@/lib/pdf/imagesToPdf";
import { downloadBytes } from "@/lib/download";

type ImageFile = { id: string; file: File; previewUrl: string };

export function ImageToPdfWorkspace() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages((current) => [
      ...current,
      ...acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
      })),
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] },
    multiple: true,
  });

  const moveImage = (index: number, direction: -1 | 1) => {
    setImages((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const removeImage = (id: string) => {
    setImages((current) => current.filter((entry) => entry.id !== id));
  };

  const handleConvert = async () => {
    setIsConverting(true);
    try {
      const inputs = await Promise.all(
        images.map(async (entry) => ({
          bytes: await entry.file.arrayBuffer(),
          mimeType: entry.file.type,
        }))
      );
      const pdfBytes = await imagesToPdf(inputs);
      downloadBytes(pdfBytes, "imagens.pdf");
    } finally {
      setIsConverting(false);
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
        <p className="font-medium">Arraste imagens (PNG ou JPG) aqui, ou clique para selecionar</p>
        <p className="text-sm text-zinc-500">Cada imagem vira uma página do PDF, na ordem abaixo.</p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((entry, index) => (
            <div
              key={entry.id}
              className="flex flex-col items-center gap-2 rounded-lg border border-zinc-200 p-2 dark:border-zinc-700"
            >
              <img src={entry.previewUrl} alt={entry.file.name} className="max-h-40 w-auto rounded" />
              <span className="text-xs text-zinc-500">{index + 1}</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => moveImage(index, -1)}
                  disabled={index === 0}
                  className="rounded px-2 py-1 text-xs hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
                  aria-label="Mover para cima"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, 1)}
                  disabled={index === images.length - 1}
                  className="rounded px-2 py-1 text-xs hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
                  aria-label="Mover para baixo"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(entry.id)}
                  className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  aria-label="Remover imagem"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleConvert}
        disabled={images.length === 0 || isConverting}
        className="self-end rounded-lg bg-zinc-900 px-5 py-2.5 font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {isConverting ? "Gerando PDF…" : "Gerar PDF e baixar"}
      </button>
    </div>
  );
}
