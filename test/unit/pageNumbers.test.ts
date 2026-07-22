import { describe, it, expect } from "vitest";
import { addPageNumbers } from "@/lib/pdf/pageNumbers";
import { createSamplePdf, toArrayBuffer } from "../fixtures";
import { extractAllText } from "../pdfText";

describe("addPageNumbers", () => {
  it("labels each page as 'N / total'", async () => {
    const bytes = toArrayBuffer(await createSamplePdf(3));
    const result = await addPageNumbers(bytes);

    const text = await extractAllText(result);
    expect(text).toContain("1 / 3");
    expect(text).toContain("2 / 3");
    expect(text).toContain("3 / 3");
  });
});
