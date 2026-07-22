import { PDFDocument } from "@cantoo/pdf-lib";

export async function getSourceRotations(bytes: ArrayBuffer): Promise<number[]> {
  const doc = await PDFDocument.load(bytes.slice(0));
  return doc.getPages().map((page) => page.getRotation().angle);
}
