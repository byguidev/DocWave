"use client";

import { useState } from "react";
import { usePdfStore } from "@/store/pdfStore";
import { addPageNumbers, type PageNumberPosition } from "@/lib/pdf/pageNumbers";
import { downloadBytes } from "@/lib/download";
import { Button } from "@/components/ui/Button";
import { inputClass } from "@/lib/ui";

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
          className={inputClass}
        >
          <option value="bottom-center">Centralizado embaixo</option>
          <option value="bottom-right">Canto inferior direito</option>
        </select>
      </label>
      <Button type="button" onClick={handleApply} disabled={isApplying}>
        {isApplying ? "Aplicando…" : "Aplicar e baixar"}
      </Button>
    </div>
  );
}
