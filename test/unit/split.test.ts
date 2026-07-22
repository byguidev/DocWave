import { describe, it, expect } from "vitest";
import { PDFDocument } from "@cantoo/pdf-lib";
import { splitToPages } from "@/lib/pdf/split";
import type { PdfPage } from "@/lib/pdf/types";
import { createSamplePdf, toArrayBuffer } from "../fixtures";

function fakePages(count: number): PdfPage[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `page-${index}`,
    sourcePageIndex: index,
    sourceRotation: 0,
    rotation: 0,
    thumbnailUrl: "",
  }));
}

describe("splitToPages", () => {
  it("produces one single-page PDF per input page", async () => {
    const bytes = toArrayBuffer(await createSamplePdf(3));
    const results = await splitToPages(bytes, fakePages(3));

    expect(results).toHaveLength(3);
    expect(results.map((r) => r.name)).toEqual(["pagina-1.pdf", "pagina-2.pdf", "pagina-3.pdf"]);

    for (const result of results) {
      const doc = await PDFDocument.load(result.data);
      expect(doc.getPageCount()).toBe(1);
    }
  });

  it("respects a subset/reordered page list", async () => {
    const bytes = toArrayBuffer(await createSamplePdf(3));
    const pages: PdfPage[] = [
      { id: "a", sourcePageIndex: 2, sourceRotation: 0, rotation: 0, thumbnailUrl: "" },
      { id: "b", sourcePageIndex: 0, sourceRotation: 0, rotation: 0, thumbnailUrl: "" },
    ];

    const results = await splitToPages(bytes, pages);
    expect(results).toHaveLength(2);
  });
});
