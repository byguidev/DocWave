let cachedLib: typeof import("pdfjs-dist") | null = null;

export async function getPdfjs() {
  if (!cachedLib) {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();
    cachedLib = pdfjsLib;
  }
  return cachedLib;
}
