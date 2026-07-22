import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";

export type WatermarkOptions = {
  text: string;
  opacity?: number;
};

export async function addTextWatermark(bytes: ArrayBuffer, options: WatermarkOptions): Promise<Uint8Array> {
  const doc = await PDFDocument.load(bytes.slice(0));
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const opacity = options.opacity ?? 0.25;

  for (const page of doc.getPages()) {
    const { width, height } = page.getSize();
    const fontSize = Math.min(width, height) / 8;
    const textWidth = font.widthOfTextAtSize(options.text, fontSize);

    page.drawText(options.text, {
      x: width / 2 - textWidth / 2,
      y: height / 2,
      size: fontSize,
      font,
      color: rgb(0.5, 0.5, 0.5),
      opacity,
      rotate: degrees(45),
    });
  }

  return doc.save();
}
