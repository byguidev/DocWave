import { describe, it, expect } from "vitest";
import { PDFDocument, degrees } from "@cantoo/pdf-lib";
import { exportPdf } from "@/lib/pdf/exportPdf";
import type { PdfPage } from "@/lib/pdf/types";
import { createSamplePdf, toArrayBuffer } from "../fixtures";

describe("exportPdf", () => {
  it("reorders and removes pages according to the given list", async () => {
    const bytes = toArrayBuffer(await createSamplePdf(3));
    // Keep only pages 3 and 1, in that order (drop page 2)
    const pages: PdfPage[] = [
      { id: "p3", sourcePageIndex: 2, sourceRotation: 0, rotation: 0, thumbnailUrl: "" },
      { id: "p1", sourcePageIndex: 0, sourceRotation: 0, rotation: 0, thumbnailUrl: "" },
    ];

    const result = await exportPdf(bytes, pages);
    const doc = await PDFDocument.load(result);
    expect(doc.getPageCount()).toBe(2);
  });

  it("sums source rotation with the user-applied rotation", async () => {
    const bytes = toArrayBuffer(await createSamplePdf(1));
    const pages: PdfPage[] = [
      { id: "p1", sourcePageIndex: 0, sourceRotation: 90, rotation: 180, thumbnailUrl: "" },
    ];

    const result = await exportPdf(bytes, pages);
    const doc = await PDFDocument.load(result);
    expect(doc.getPage(0).getRotation()).toEqual(degrees(270));
  });
});
