import { getPdfjs } from "./pdfjs";

export type ImageResult = { name: string; data: Uint8Array };

export async function pdfToImages(bytes: ArrayBuffer, scale = 2): Promise<ImageResult[]> {
  const pdfjsLib = await getPdfjs();
  const loadingTask = pdfjsLib.getDocument({ data: bytes.slice(0) });
  const doc = await loadingTask.promise;
  const results: ImageResult[] = [];

  for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
    const page = await doc.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Não foi possível criar o contexto do canvas");

    await page.render({ canvas, canvasContext: context, viewport }).promise;
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("Não foi possível gerar a imagem da página");
    const data = new Uint8Array(await blob.arrayBuffer());
    results.push({ name: `pagina-${pageNumber}.png`, data });
  }

  await loadingTask.destroy();
  return results;
}
