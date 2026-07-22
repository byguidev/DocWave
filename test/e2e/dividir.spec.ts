import path from "path";
import { readFile } from "fs/promises";
import { test, expect } from "@playwright/test";
import { unzipSync } from "fflate";

const SAMPLE = path.join(__dirname, "fixtures/sample.pdf");

test("dividir gera um zip com um PDF por página", async ({ page }) => {
  await page.goto("/dividir");
  await page.setInputFiles('input[type="file"]', SAMPLE);
  await expect(page.locator("img[alt='Página 1']")).toBeVisible();

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: /Dividir e baixar/ }).click(),
  ]);

  const filePath = await download.path();
  if (!filePath) throw new Error("download path is null");
  const entries = unzipSync(new Uint8Array(await readFile(filePath)));
  expect(Object.keys(entries).sort()).toEqual(["pagina-1.pdf", "pagina-2.pdf", "pagina-3.pdf"]);
});
