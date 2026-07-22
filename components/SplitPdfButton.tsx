"use client";

import { useState } from "react";
import { usePdfStore } from "@/store/pdfStore";
import { splitToPages } from "@/lib/pdf/split";
import { zipFiles } from "@/lib/pdf/zip";
import { downloadBytes } from "@/lib/download";

export function SplitPdfButton() {
  const { fileName, bytes, pages } = usePdfStore();
  const [isSplitting, setIsSplitting] = useState(false);

  if (!fileName || !bytes || pages.length === 0) return null;

  const handleSplit = async () => {
    setIsSplitting(true);
    try {
      const files = await splitToPages(bytes, pages);
      if (files.length === 1) {
        downloadBytes(files[0].data, files[0].name);
        return;
      }
      const zipped = zipFiles(files);
      downloadBytes(zipped, fileName.replace(/\.pdf$/i, "") + "-paginas.zip", "application/zip");
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSplit}
      disabled={isSplitting}
      className="rounded-lg bg-zinc-900 px-5 py-2.5 font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
    >
      {isSplitting ? "Dividindo…" : pages.length === 1 ? "Baixar PDF" : "Dividir e baixar (.zip)"}
    </button>
  );
}
