import { PDFDocument } from "@cantoo/pdf-lib";
import { getPdfjs } from "./pdfjs";

export type CompressOptions = {
  /** 0..1, menor = mais compressão */
  quality?: number;
  /** Escala de renderização antes de recomprimir; maior preserva mais nitidez. */
  scale?: number;
};

export async function compressPdf(bytes: ArrayBuffer, options: CompressOptions = {}): Promise<Uint8Array> {
  const quality = options.quality ?? 0.6;
  const scale = options.scale ?? 1.5;

  const pdfjsLib = await getPdfjs();
  const loadingTask = pdfjsLib.getDocument({ data: bytes.slice(0) });
  const srcDoc = await loadingTask.promise;
  const outDoc = await PDFDocument.create();

  for (let pageNumber = 1; pageNumber <= srcDoc.numPages; pageNumber++) {
    const page = await srcDoc.getPage(pageNumber);
    const baseViewport = page.getViewport({ scale: 1 });
    const renderViewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = renderViewport.width;
    canvas.height = renderViewport.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Não foi possível criar o contexto do canvas");

    await page.render({ canvas, canvasContext: context, viewport: renderViewport }).promise;
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob) throw new Error("Não foi possível gerar a imagem da página");
    const imageBytes = new Uint8Array(await blob.arrayBuffer());

    const embedded = await outDoc.embedJpg(imageBytes);
    const outPage = outDoc.addPage([baseViewport.width, baseViewport.height]);
    outPage.drawImage(embedded, {
      x: 0,
      y: 0,
      width: baseViewport.width,
      height: baseViewport.height,
    });
  }

  await loadingTask.destroy();
  return outDoc.save();
}
