"use client";

import { useState } from "react";
import { usePdfStore } from "@/store/pdfStore";
import { pdfToImages } from "@/lib/pdf/pdfToImages";
import { zipFiles } from "@/lib/pdf/zip";
import { downloadBytes } from "@/lib/download";
import { Button } from "@/components/ui/Button";

export function PdfToImagesButton() {
  const { fileName, bytes } = usePdfStore();
  const [isConverting, setIsConverting] = useState(false);

  if (!fileName || !bytes) return null;

  const handleConvert = async () => {
    setIsConverting(true);
    try {
      const images = await pdfToImages(bytes);
      const baseName = fileName.replace(/\.pdf$/i, "");
      if (images.length === 1) {
        downloadBytes(images[0].data, `${baseName}.png`, "image/png");
        return;
      }
      const zipped = zipFiles(images);
      downloadBytes(zipped, `${baseName}-imagens.zip`, "application/zip");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <Button type="button" onClick={handleConvert} disabled={isConverting}>
      {isConverting ? "Convertendo…" : "Converter para imagem"}
    </Button>
  );
}
