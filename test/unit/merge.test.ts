import { describe, it, expect } from "vitest";
import { PDFDocument } from "@cantoo/pdf-lib";
import { mergePdfs } from "@/lib/pdf/merge";
import { createSamplePdf, toArrayBuffer } from "../fixtures";

describe("mergePdfs", () => {
  it("concatenates pages from multiple PDFs in order", async () => {
    const a = toArrayBuffer(await createSamplePdf(2));
    const b = toArrayBuffer(await createSamplePdf(3));

    const merged = await mergePdfs([a, b]);
    const doc = await PDFDocument.load(merged);

    expect(doc.getPageCount()).toBe(5);
  });
});
