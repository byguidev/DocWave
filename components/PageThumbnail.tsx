"use client";

import type { PdfPage } from "@/lib/pdf/types";

type PageThumbnailProps = {
  page: PdfPage;
  index: number;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDrop: () => void;
  onRotate: (pageId: string) => void;
  onRemove: (pageId: string) => void;
};

export function PageThumbnail({
  page,
  index,
  onDragStart,
  onDragOver,
  onDrop,
  onRotate,
  onRemove,
}: PageThumbnailProps) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(event) => {
        event.preventDefault();
        onDragOver(index);
      }}
      onDrop={onDrop}
      className="group relative flex flex-col items-center gap-2 rounded-lg border border-zinc-200 bg-white p-2 shadow-sm cursor-grab active:cursor-grabbing dark:border-zinc-700 dark:bg-zinc-900"
    >
      <img
        src={page.thumbnailUrl}
        alt={`Página ${index + 1}`}
        style={{ transform: `rotate(${page.rotation}deg)` }}
        className="max-h-48 w-auto select-none rounded shadow"
      />
      <span className="text-xs text-zinc-500">{index + 1}</span>
      <div className="absolute inset-x-0 top-0 flex justify-end gap-1 p-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={() => onRotate(page.id)}
          className="rounded bg-zinc-900/70 px-2 py-1 text-xs text-white hover:bg-zinc-900"
          aria-label="Girar página"
        >
          ⟳
        </button>
        <button
          type="button"
          onClick={() => onRemove(page.id)}
          className="rounded bg-red-600/80 px-2 py-1 text-xs text-white hover:bg-red-600"
          aria-label="Remover página"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
