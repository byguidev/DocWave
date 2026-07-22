import { PDFDocument } from "@cantoo/pdf-lib";

export async function protectPdf(bytes: ArrayBuffer, password: string): Promise<Uint8Array> {
  const doc = await PDFDocument.load(bytes.slice(0));
  doc.encrypt({ userPassword: password, ownerPassword: password });
  return doc.save();
}
