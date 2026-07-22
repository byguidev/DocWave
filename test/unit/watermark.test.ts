import { describe, it, expect } from "vitest";
import { addTextWatermark } from "@/lib/pdf/watermark";
import { createSamplePdf, toArrayBuffer } from "../fixtures";
import { extractAllText } from "../pdfText";

describe("addTextWatermark", () => {
  it("draws the given text on every page", async () => {
    const bytes = toArrayBuffer(await createSamplePdf(2));
    const result = await addTextWatermark(bytes, { text: "CONFIDENCIAL" });

    const text = await extractAllText(result);
    expect(text).toContain("CONFIDENCIAL");
    expect(text.split("CONFIDENCIAL").length - 1).toBe(2);
  });
});
