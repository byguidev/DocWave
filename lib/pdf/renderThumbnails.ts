import { getPdfjs } from "./pdfjs";

const THUMBNAIL_WIDTH = 200;

export async function renderThumbnails(bytes: ArrayBuffer): Promise<string[]> {
  const pdfjsLib = await getPdfjs();
  const loadingTask = pdfjsLib.getDocument({ data: bytes.slice(0) });
  const doc = await loadingTask.promise;
  const thumbnails: string[] = [];

  for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
    const page = await doc.getPage(pageNumber);
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = THUMBNAIL_WIDTH / baseViewport.width;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Não foi possível criar o contexto do canvas");

    await page.render({ canvas, canvasContext: context, viewport }).promise;
    thumbnails.push(canvas.toDataURL("image/png"));
  }

  await loadingTask.destroy();
  return thumbnails;
}
