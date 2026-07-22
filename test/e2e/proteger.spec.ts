import path from "path";
import { readFile } from "fs/promises";
import { test, expect } from "@playwright/test";
import { PDFDocument } from "@cantoo/pdf-lib";

const SAMPLE = path.join(__dirname, "fixtures/sample.pdf");

test("proteger gera um PDF que não abre sem senha", async ({ page }) => {
  await page.goto("/proteger");
  await page.setInputFiles('input[type="file"]', SAMPLE);
  await page.fill('input[type="password"]', "senha123");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Proteger e baixar" }).click(),
  ]);

  const filePath = await download.path();
  if (!filePath) throw new Error("download path is null");
  const bytes = await readFile(filePath);

  await expect(PDFDocument.load(bytes)).rejects.toThrow();

  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  expect(doc.isEncrypted).toBe(true);
});
