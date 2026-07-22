import { PDFDocument } from "@cantoo/pdf-lib";

export type ImageInput = { bytes: ArrayBuffer; mimeType: string };

export async function imagesToPdf(images: ImageInput[]): Promise<Uint8Array> {
  const doc = await PDFDocument.create();

  for (const image of images) {
    const embedded =
      image.mimeType === "image/png"
        ? await doc.embedPng(image.bytes)
        : await doc.embedJpg(image.bytes);

    const { width, height } = embedded.scale(0.75);
    const page = doc.addPage([width, height]);
    page.drawImage(embedded, { x: 0, y: 0, width, height });
  }

  return doc.save();
}
