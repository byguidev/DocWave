"use client";

import { useState } from "react";
import { usePdfStore } from "@/store/pdfStore";
import { ocrPdf, type OcrProgress } from "@/lib/pdf/ocr";
import { textToDocx } from "@/lib/pdf/textToDocx";
import { downloadBytes } from "@/lib/download";
import { Button } from "@/components/ui/Button";

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const STATUS_LABELS: Record<string, string> = {
  "loading tesseract core": "Carregando mecanismo de OCR…",
  "initializing tesseract": "Inicializando…",
  "loading language traineddata": "Baixando modelo de idioma…",
  "initializing api": "Preparando…",
  "recognizing text": "Reconhecendo texto",
};

export function OcrForm() {
  const { fileName, bytes } = usePdfStore();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<OcrProgress | null>(null);

  if (!fileName || !bytes) return null;

  const handleRun = async () => {
    setIsRunning(true);
    setProgress(null);
    try {
      const pagesText = await ocrPdf(bytes, setProgress);
      const docxBytes = await textToDocx(pagesText);
      downloadBytes(docxBytes, fileName.replace(/\.pdf$/i, "") + "-ocr.docx", DOCX_MIME);
    } finally {
      setIsRunning(false);
      setProgress(null);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <Button type="button" onClick={handleRun} disabled={isRunning}>
        {isRunning ? "Reconhecendo…" : "Reconhecer texto (OCR)"}
      </Button>
      {progress && (
        <div className="w-full max-w-xs text-right text-xs text-muted">
          {STATUS_LABELS[progress.status] ?? progress.status}
          {progress.totalPages > 0 && ` · página ${progress.pageIndex}/${progress.totalPages}`}
          {" · "}
          {Math.round(progress.progress * 100)}%
        </div>
      )}
      <p className="text-xs text-muted">
        Reconhece português e inglês. A primeira execução baixa o modelo de idioma (alguns MB).
      </p>
    </div>
  );
}
