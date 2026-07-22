"use client";

import { useState } from "react";
import { usePdfStore } from "@/store/pdfStore";
import { addTextWatermark } from "@/lib/pdf/watermark";
import { downloadBytes } from "@/lib/download";

export function WatermarkForm() {
  const { fileName, bytes } = usePdfStore();
  const [text, setText] = useState("CONFIDENCIAL");
  const [isApplying, setIsApplying] = useState(false);

  if (!fileName || !bytes) return null;

  const handleApply = async () => {
    if (!text.trim()) return;
    setIsApplying(true);
    try {
      const result = await addTextWatermark(bytes, { text: text.trim() });
      downloadBytes(result, fileName.replace(/\.pdf$/i, "") + "-marca-dagua.pdf");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex flex-1 flex-col gap-1 text-sm">
        Texto da marca d&apos;água
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </label>
      <button
        type="button"
        onClick={handleApply}
        disabled={isApplying || !text.trim()}
        className="rounded-lg bg-zinc-900 px-5 py-2.5 font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {isApplying ? "Aplicando…" : "Aplicar e baixar"}
      </button>
    </div>
  );
}
