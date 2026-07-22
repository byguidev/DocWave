import { PDFDocument } from "pdf-lib";
import type { PdfPage } from "./types";
import { applyPageRotation } from "./rotation";

export type SplitResult = { name: string; data: Uint8Array };

export async function splitToPages(bytes: ArrayBuffer, pages: PdfPage[]): Promise<SplitResult[]> {
  const srcDoc = await PDFDocument.load(bytes.slice(0));
  const results: SplitResult[] = [];

  for (let index = 0; index < pages.length; index++) {
    const outDoc = await PDFDocument.create();
    const [copiedPage] = await outDoc.copyPages(srcDoc, [pages[index].sourcePageIndex]);
    applyPageRotation(copiedPage, pages[index]);
    outDoc.addPage(copiedPage);
    results.push({ name: `pagina-${index + 1}.pdf`, data: await outDoc.save() });
  }

  return results;
}
