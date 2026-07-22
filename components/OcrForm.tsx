"use client";

import { useState } from "react";
import { usePdfStore } from "@/store/pdfStore";
import { ocrPdf, type OcrProgress } from "@/lib/pdf/ocr";
import { textToDocx } from "@/lib/pdf/textToDocx";
import { downloadBytes } from "@/lib/download";

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
      <button
        type="button"
        onClick={handleRun}
        disabled={isRunning}
        className="rounded-lg bg-zinc-900 px-5 py-2.5 font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {isRunning ? "Reconhecendo…" : "Reconhecer texto (OCR)"}
      </button>
      {progress && (
        <div className="w-full max-w-xs text-right text-xs text-zinc-500">
          {STATUS_LABELS[progress.status] ?? progress.status}
          {progress.totalPages > 0 && ` · página ${progress.pageIndex}/${progress.totalPages}`}
          {" · "}
          {Math.round(progress.progress * 100)}%
        </div>
      )}
      <p className="text-xs text-zinc-500">
        Reconhece português e inglês. A primeira execução baixa o modelo de idioma (alguns MB).
      </p>
    </div>
  );
}
