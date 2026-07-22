import path from "path";
import { readFile } from "fs/promises";
import { test, expect } from "@playwright/test";
import { PDFDocument } from "@cantoo/pdf-lib";

const SAMPLE = path.join(__dirname, "fixtures/sample.pdf");

test("mesclar combina páginas de dois PDFs", async ({ page }) => {
  await page.goto("/mesclar");
  await page.setInputFiles('input[type="file"]', [SAMPLE, SAMPLE]);
  await expect(page.locator("text=1. sample.pdf")).toBeVisible();

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "Mesclar e baixar" }).click(),
  ]);

  const filePath = await download.path();
  if (!filePath) throw new Error("download path is null");
  const doc = await PDFDocument.load(await readFile(filePath));
  expect(doc.getPageCount()).toBe(6);
});
