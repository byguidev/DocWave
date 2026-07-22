"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowUp, ArrowDown, X } from "lucide-react";
import { imagesToPdf } from "@/lib/pdf/imagesToPdf";
import { downloadBytes } from "@/lib/download";
import { Button } from "@/components/ui/Button";
import { dropzoneClass } from "@/lib/ui";

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
      <div {...getRootProps()} className={`min-h-40 ${dropzoneClass(isDragActive)}`}>
        <input {...getInputProps()} />
        <p className="font-medium">Arraste imagens (PNG ou JPG) aqui, ou clique para selecionar</p>
        <p className="text-sm text-muted">Cada imagem vira uma página do PDF, na ordem abaixo.</p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((entry, index) => (
            <div
              key={entry.id}
              className="flex flex-col items-center gap-2 rounded-lg border border-border p-2"
            >
              <img src={entry.previewUrl} alt={entry.file.name} className="max-h-40 w-auto rounded" />
              <span className="text-xs text-muted">{index + 1}</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => moveImage(index, -1)}
                  disabled={index === 0}
                  className="rounded p-1 text-muted hover:bg-brand-soft hover:text-brand disabled:opacity-30"
                  aria-label="Mover para cima"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, 1)}
                  disabled={index === images.length - 1}
                  className="rounded p-1 text-muted hover:bg-brand-soft hover:text-brand disabled:opacity-30"
                  aria-label="Mover para baixo"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(entry.id)}
                  className="rounded p-1 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  aria-label="Remover imagem"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        onClick={handleConvert}
        disabled={images.length === 0 || isConverting}
        className="self-end"
      >
        {isConverting ? "Gerando PDF…" : "Gerar PDF e baixar"}
      </Button>
    </div>
  );
}
