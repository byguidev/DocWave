import { create } from "zustand";
import type { PdfPage } from "@/lib/pdf/types";
import { renderThumbnails } from "@/lib/pdf/renderThumbnails";

type PdfStoreState = {
  fileName: string | null;
  bytes: ArrayBuffer | null;
  pages: PdfPage[];
  isLoading: boolean;
  error: string | null;
  loadFile: (file: File) => Promise<void>;
  reorderPages: (fromIndex: number, toIndex: number) => void;
  rotatePage: (pageId: string) => void;
  removePage: (pageId: string) => void;
  reset: () => void;
};

export const usePdfStore = create<PdfStoreState>((set, get) => ({
  fileName: null,
  bytes: null,
  pages: [],
  isLoading: false,
  error: null,

  loadFile: async (file: File) => {
    set({ isLoading: true, error: null });
    try {
      const bytes = await file.arrayBuffer();
      const thumbnailUrls = await renderThumbnails(bytes);
      const pages: PdfPage[] = thumbnailUrls.map((thumbnailUrl, index) => ({
        id: `${file.name}-${index}-${crypto.randomUUID()}`,
        sourcePageIndex: index,
        rotation: 0,
        thumbnailUrl,
      }));
      set({ fileName: file.name, bytes, pages, isLoading: false });
    } catch {
      set({
        error: "Não foi possível ler este PDF. Verifique se o arquivo não está corrompido.",
        isLoading: false,
      });
    }
  },

  reorderPages: (fromIndex, toIndex) => {
    const pages = [...get().pages];
    const [moved] = pages.splice(fromIndex, 1);
    pages.splice(toIndex, 0, moved);
    set({ pages });
  },

  rotatePage: (pageId) => {
    set({
      pages: get().pages.map((page) =>
        page.id === pageId
          ? { ...page, rotation: (((page.rotation + 90) % 360) as PdfPage["rotation"]) }
          : page
      ),
    });
  },

  removePage: (pageId) => {
    set({ pages: get().pages.filter((page) => page.id !== pageId) });
  },

  reset: () => set({ fileName: null, bytes: null, pages: [], error: null }),
}));
