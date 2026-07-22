export type PdfPage = {
  id: string;
  sourcePageIndex: number;
  rotation: 0 | 90 | 180 | 270;
  thumbnailUrl: string;
};

export type PdfDocument = {
  fileName: string;
  bytes: ArrayBuffer;
  pages: PdfPage[];
};
