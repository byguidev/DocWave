import { describe, it, expect } from "vitest";
import { PDFDocument } from "@cantoo/pdf-lib";
import { protectPdf } from "@/lib/pdf/protect";
import { unlockPdf } from "@/lib/pdf/unlock";
import { createSamplePdf, toArrayBuffer } from "../fixtures";

describe("protectPdf + unlockPdf", () => {
  it("encrypts the PDF so it cannot be opened without the password", async () => {
    const bytes = toArrayBuffer(await createSamplePdf(2));
    const protectedBytes = await protectPdf(bytes, "senha123");

    await expect(PDFDocument.load(protectedBytes)).rejects.toThrow();

    const doc = await PDFDocument.load(protectedBytes, { ignoreEncryption: true });
    expect(doc.isEncrypted).toBe(true);
  });

  it("rejects the wrong password", async () => {
    const bytes = toArrayBuffer(await createSamplePdf(2));
    const protectedBytes = await protectPdf(bytes, "senha123");

    await expect(unlockPdf(toArrayBuffer(protectedBytes), "senha-errada")).rejects.toThrow(
      "Senha incorreta"
    );
  });

  it("removes the password and preserves page count with the right password", async () => {
    const bytes = toArrayBuffer(await createSamplePdf(3));
    const protectedBytes = await protectPdf(bytes, "senha123");

    const unlockedBytes = await unlockPdf(toArrayBuffer(protectedBytes), "senha123");

    // Regression test for a @cantoo/pdf-lib bug where resaving a decrypted
    // PDFDocument directly left a stale /Encrypt reference in the output.
    const doc = await PDFDocument.load(unlockedBytes);
    expect(doc.isEncrypted).toBe(false);
    expect(doc.getPageCount()).toBe(3);
  });
});
