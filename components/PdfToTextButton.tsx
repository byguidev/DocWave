"use client";

import { useState } from "react";
import { usePdfStore } from "@/store/pdfStore";
import { extractText } from "@/lib/pdf/extractText";
import { textToDocx } from "@/lib/pdf/textToDocx";
import { downloadBytes } from "@/lib/download";

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
      <button
        type="button"
        onClick={handleConvert}
        disabled={isConverting}
        className="rounded-lg bg-zinc-900 px-5 py-2.5 font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {isConverting ? "Extraindo…" : "Extrair texto (.docx)"}
      </button>
      <p className="text-xs text-zinc-500">
        Exporta apenas o texto, sem preservar layout, tabelas ou imagens.
      </p>
    </div>
  );
}
