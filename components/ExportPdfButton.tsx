"use client";

import { useState } from "react";
import { usePdfStore } from "@/store/pdfStore";
import { exportPdf } from "@/lib/pdf/exportPdf";
import { downloadBytes } from "@/lib/download";
import { Button } from "@/components/ui/Button";

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
    <Button type="button" onClick={handleExport} disabled={isExporting}>
      {isExporting ? "Gerando PDF…" : "Baixar PDF"}
    </Button>
  );
}
