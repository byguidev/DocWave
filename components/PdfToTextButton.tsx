"use client";

import { useState } from "react";
import { usePdfStore } from "@/store/pdfStore";
import { extractText } from "@/lib/pdf/extractText";
import { textToDocx } from "@/lib/pdf/textToDocx";
import { downloadBytes } from "@/lib/download";
import { Button } from "@/components/ui/Button";

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export function PdfToTextButton() {
  const { fileName, bytes } = usePdfStore();
  const [isConverting, setIsConverting] = useState(false);

  if (!fileName || !bytes) return null;

  const handleConvert = async () => {
    setIsConverting(true);
    try {
      const pagesText = await extractText(bytes);
      const docxBytes = await textToDocx(pagesText);
      downloadBytes(docxBytes, fileName.replace(/\.pdf$/i, "") + ".docx", DOCX_MIME);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button type="button" onClick={handleConvert} disabled={isConverting}>
        {isConverting ? "Extraindo…" : "Extrair texto (.docx)"}
      </Button>
      <p className="text-xs text-muted">
        Exporta apenas o texto, sem preservar layout, tabelas ou imagens.
      </p>
    </div>
  );
}
