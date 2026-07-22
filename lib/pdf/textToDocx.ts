import { Document, Packer, Paragraph, PageBreak } from "docx";

export async function textToDocx(pagesText: string[]): Promise<Uint8Array> {
  const children: Paragraph[] = [];

  pagesText.forEach((pageText, index) => {
    if (index > 0) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }
    const lines = pageText.split("\n").filter((line) => line.length > 0);
    (lines.length > 0 ? lines : [""]).forEach((line) => {
      children.push(new Paragraph(line));
    });
  });

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  return new Uint8Array(await blob.arrayBuffer());
}
