"use client";

import { useState } from "react";
import { usePdfStore } from "@/store/pdfStore";
import { addPageNumbers, type PageNumberPosition } from "@/lib/pdf/pageNumbers";
import { downloadBytes } from "@/lib/download";

export function PageNumbersForm() {
  const { fileName, bytes } = usePdfStore();
  const [position, setPosition] = useState<PageNumberPosition>("bottom-center");
  const [isApplying, setIsApplying] = useState(false);

  if (!fileName || !bytes) return null;

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const result = await addPageNumbers(bytes, { position });
      downloadBytes(result, fileName.replace(/\.pdf$/i, "") + "-numerado.pdf");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Posição
        <select
          value={position}
          onChange={(event) => setPosition(event.target.value as PageNumberPosition)}
          className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        >
          <option value="bottom-center">Centralizado embaixo</option>
          <option value="bottom-right">Canto inferior direito</option>
        </select>
      </label>
      <button
        type="button"
        onClick={handleApply}
        disabled={isApplying}
        className="rounded-lg bg-zinc-900 px-5 py-2.5 font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {isApplying ? "Aplicando…" : "Aplicar e baixar"}
      </button>
    </div>
  );
}
