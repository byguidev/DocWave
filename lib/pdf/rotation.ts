import { degrees, type PDFPage } from "pdf-lib";
import type { PdfPage } from "./types";

export function applyPageRotation(page: PDFPage, pdfPage: PdfPage) {
  const finalRotation = (pdfPage.sourceRotation + pdfPage.rotation) % 360;
  page.setRotation(degrees(finalRotation));
}
