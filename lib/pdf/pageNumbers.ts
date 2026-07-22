import { PDFDocument, StandardFonts, rgb } from "@cantoo/pdf-lib";

export type PageNumberPosition = "bottom-center" | "bottom-right";

export type PageNumberOptions = {
  position?: PageNumberPosition;
};

export async function addPageNumbers(bytes: ArrayBuffer, options: PageNumberOptions = {}): Promise<Uint8Array> {
  const doc = await PDFDocument.load(bytes.slice(0));
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const position = options.position ?? "bottom-center";
  const pages = doc.getPages();
  const fontSize = 10;
  const margin = 24;

  pages.forEach((page, index) => {
    const { width } = page.getSize();
    const label = `${index + 1} / ${pages.length}`;
    const textWidth = font.widthOfTextAtSize(label, fontSize);
    const x = position === "bottom-right" ? width - textWidth - margin : width / 2 - textWidth / 2;

    page.drawText(label, {
      x,
      y: margin / 2,
      size: fontSize,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });
  });

  return doc.save();
}
