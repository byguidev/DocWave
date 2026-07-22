import { PDFDocument } from "@cantoo/pdf-lib";

export async function mergePdfs(fileByteArrays: ArrayBuffer[]): Promise<Uint8Array> {
  const outDoc = await PDFDocument.create();

  for (const bytes of fileByteArrays) {
    const srcDoc = await PDFDocument.load(bytes.slice(0));
    const copiedPages = await outDoc.copyPages(srcDoc, srcDoc.getPageIndices());
    copiedPages.forEach((page) => outDoc.addPage(page));
  }

  return outDoc.save();
}
