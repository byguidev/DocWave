import { getPdfjs } from "./pdfjs";

export async function extractText(bytes: ArrayBuffer): Promise<string[]> {
  const pdfjsLib = await getPdfjs();
  const loadingTask = pdfjsLib.getDocument({ data: bytes.slice(0) });
  const doc = await loadingTask.promise;
  const pagesText: string[] = [];

  for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
    const page = await doc.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items.map((item) => ("str" in item ? item.str : "")).join(" ");
    pagesText.push(text);
  }

  await loadingTask.destroy();
  return pagesText;
}
