export type PdfPage = {
  id: string;
  sourcePageIndex: number;
  /** Rotação já existente no PDF de origem (graus). */
  sourceRotation: number;
  /** Rotação adicional aplicada pelo usuário, somada à sourceRotation na exportação. */
  rotation: 0 | 90 | 180 | 270;
  thumbnailUrl: string;
};

export type PdfDocument = {
  fileName: string;
  bytes: ArrayBuffer;
  pages: PdfPage[];
};
