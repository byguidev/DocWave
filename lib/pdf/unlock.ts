import { PDFDocument } from "@cantoo/pdf-lib";

export async function unlockPdf(bytes: ArrayBuffer, password: string): Promise<Uint8Array> {
  let doc: PDFDocument;
  try {
    doc = await PDFDocument.load(bytes.slice(0), { password });
  } catch {
    throw new Error("Senha incorreta ou arquivo corrompido.");
  }

  // Resaving a decrypted PDFDocument directly can leave a stale /Encrypt
  // reference in the output (the loaded context still carries it internally
  // even though `isEncrypted` reports false). Copying pages into a brand new
  // document guarantees the result has no encryption dictionary at all.
  const outDoc = await PDFDocument.create();
  const copiedPages = await outDoc.copyPages(doc, doc.getPageIndices());
  copiedPages.forEach((page) => outDoc.addPage(page));
  return outDoc.save();
}
