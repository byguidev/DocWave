import { PDFDocument, StandardFonts, rgb } from "@cantoo/pdf-lib";

export async function createSamplePdf(pageCount = 3): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);

  for (let i = 0; i < pageCount; i++) {
    const page = doc.addPage([300, 400]);
    page.drawText(`Pagina ${i + 1}`, { x: 40, y: 200, size: 24, font, color: rgb(0, 0, 0) });
  }

  return doc.save();
}

export function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}
