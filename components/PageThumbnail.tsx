"use client";

import { RotateCw, X } from "lucide-react";
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
      className="group relative flex cursor-grab flex-col items-center gap-2 rounded-lg border border-border bg-surface p-2 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing"
    >
      <img
        src={page.thumbnailUrl}
        alt={`Página ${index + 1}`}
        style={{ transform: `rotate(${page.rotation}deg)` }}
        className="max-h-48 w-auto select-none rounded shadow"
      />
      <span className="text-xs text-muted">{index + 1}</span>
      <div className="absolute inset-x-0 top-0 flex justify-end gap-1 p-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={() => onRotate(page.id)}
          className="rounded bg-brand/90 p-1.5 text-brand-foreground hover:bg-brand"
          aria-label="Girar página"
        >
          <RotateCw className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(page.id)}
          className="rounded bg-rose-600/90 p-1.5 text-white hover:bg-rose-600"
          aria-label="Remover página"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
