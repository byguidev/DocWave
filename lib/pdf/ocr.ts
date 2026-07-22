import { createWorker } from "tesseract.js";
import { getPdfjs } from "./pdfjs";

export type OcrProgress = {
  pageIndex: number;
  totalPages: number;
  status: string;
  progress: number;
};

export async function ocrPdf(
  bytes: ArrayBuffer,
  onProgress?: (progress: OcrProgress) => void
): Promise<string[]> {
  const pdfjsLib = await getPdfjs();
  const loadingTask = pdfjsLib.getDocument({ data: bytes.slice(0) });
  const doc = await loadingTask.promise;
  const totalPages = doc.numPages;

  let currentPage = 0;
  const worker = await createWorker(["por", "eng"], undefined, {
    logger: (data) => {
      onProgress?.({
        pageIndex: currentPage,
        totalPages,
        status: data.status,
        progress: data.progress,
      });
    },
  });

  const pagesText: string[] = [];
  try {
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
      currentPage = pageNumber;
      const page = await doc.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Não foi possível criar o contexto do canvas");

      await page.render({ canvas, canvasContext: context, viewport }).promise;
      const { data } = await worker.recognize(canvas);
      pagesText.push(data.text);
    }
  } finally {
    await worker.terminate();
    await loadingTask.destroy();
  }

  return pagesText;
}
