"use client";

import { useState } from "react";
import { usePdfStore } from "@/store/pdfStore";
import { addTextWatermark } from "@/lib/pdf/watermark";
import { downloadBytes } from "@/lib/download";
import { Button } from "@/components/ui/Button";
import { inputClass } from "@/lib/ui";

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
          className={inputClass}
        />
      </label>
      <Button type="button" onClick={handleApply} disabled={isApplying || !text.trim()}>
        {isApplying ? "Aplicando…" : "Aplicar e baixar"}
      </Button>
    </div>
  );
}
