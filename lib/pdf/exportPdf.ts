import { PDFDocument } from "pdf-lib";
import type { PdfPage } from "./types";
import { applyPageRotation } from "./rotation";

export async function exportPdf(bytes: ArrayBuffer, pages: PdfPage[]): Promise<Uint8Array> {
  const srcDoc = await PDFDocument.load(bytes.slice(0));
  const outDoc = await PDFDocument.create();
  const copiedPages = await outDoc.copyPages(
    srcDoc,
    pages.map((page) => page.sourcePageIndex)
  );

  copiedPages.forEach((copiedPage, index) => {
    applyPageRotation(copiedPage, pages[index]);
    outDoc.addPage(copiedPage);
  });

  return outDoc.save();
}
