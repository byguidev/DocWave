"use client";

import { useState } from "react";
import { usePdfStore } from "@/store/pdfStore";
import { compressPdf } from "@/lib/pdf/compress";
import { downloadBytes } from "@/lib/download";

type Level = "high" | "balanced" | "max";

const LEVELS: Record<Level, { label: string; quality: number; scale: number }> = {
  high: { label: "Alta qualidade", quality: 0.8, scale: 2 },
  balanced: { label: "Equilibrado", quality: 0.6, scale: 1.5 },
  max: { label: "Máxima compressão", quality: 0.35, scale: 1.1 },
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CompressForm() {
  const { fileName, bytes } = usePdfStore();
  const [level, setLevel] = useState<Level>("balanced");
  const [isCompressing, setIsCompressing] = useState(false);
  const [result, setResult] = useState<{ originalSize: number; compressedSize: number } | null>(null);

  if (!fileName || !bytes) return null;

  const handleCompress = async () => {
    setIsCompressing(true);
    setResult(null);
    try {
      const { quality, scale } = LEVELS[level];
      const compressed = await compressPdf(bytes, { quality, scale });
      setResult({ originalSize: bytes.byteLength, compressedSize: compressed.byteLength });
      downloadBytes(compressed, fileName.replace(/\.pdf$/i, "") + "-comprimido.pdf");
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Nível de compressão
          <select
            value={level}
            onChange={(event) => setLevel(event.target.value as Level)}
            className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          >
            {Object.entries(LEVELS).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={handleCompress}
          disabled={isCompressing}
          className="rounded-lg bg-zinc-900 px-5 py-2.5 font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {isCompressing ? "Comprimindo…" : "Comprimir e baixar"}
        </button>
      </div>
      {result && (
        <p className="text-xs text-zinc-500">
          {formatSize(result.originalSize)} → {formatSize(result.compressedSize)}
        </p>
      )}
      <p className="text-xs text-zinc-500">
        Cada página é recomprimida como imagem JPEG. Texto selecionável não é preservado.
      </p>
    </div>
  );
}
