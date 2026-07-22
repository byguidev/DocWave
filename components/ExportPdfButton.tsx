"use client";

import { useState } from "react";
import { usePdfStore } from "@/store/pdfStore";
import { exportPdf } from "@/lib/pdf/exportPdf";
import { downloadBytes } from "@/lib/download";

export function ExportPdfButton() {
  const { fileName, bytes, pages } = usePdfStore();
  const [isExporting, setIsExporting] = useState(false);

  if (!fileName || !bytes || pages.length === 0) return null;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportPdf(bytes, pages);
      downloadBytes(result, fileName.replace(/\.pdf$/i, "") + "-editado.pdf");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isExporting}
      className="rounded-lg bg-zinc-900 px-5 py-2.5 font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
    >
      {isExporting ? "Gerando PDF…" : "Baixar PDF"}
    </button>
  );
}
