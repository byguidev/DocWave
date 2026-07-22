"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { protectPdf } from "@/lib/pdf/protect";
import { unlockPdf } from "@/lib/pdf/unlock";
import { downloadBytes } from "@/lib/download";
import { Button } from "@/components/ui/Button";
import { inputClass, dropzoneClass } from "@/lib/ui";

type Mode = "protect" | "unlock";

const COPY: Record<Mode, { action: string; suffix: string; passwordLabel: string }> = {
  protect: {
    action: "Proteger e baixar",
    suffix: "-protegido.pdf",
    passwordLabel: "Senha para proteger o PDF",
  },
  unlock: {
    action: "Remover senha e baixar",
    suffix: "-sem-senha.pdf",
    passwordLabel: "Senha atual do PDF",
  },
};

export function PasswordToolForm({ mode }: { mode: Mode }) {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copy = COPY[mode];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0] ?? null);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!file || !password) return;
    setIsProcessing(true);
    setError(null);
    try {
      const bytes = await file.arrayBuffer();
      const result = mode === "protect" ? await protectPdf(bytes, password) : await unlockPdf(bytes, password);
      downloadBytes(result, file.name.replace(/\.pdf$/i, "") + copy.suffix);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível processar o PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div {...getRootProps()} className={`min-h-40 ${dropzoneClass(isDragActive)}`}>
        <input {...getInputProps()} />
        <p className="font-medium">
          {file ? file.name : "Arraste um PDF aqui ou clique para selecionar"}
        </p>
        <p className="text-sm text-muted">O arquivo não sai do seu navegador.</p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          {copy.passwordLabel}
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
          />
        </label>
        <Button type="button" onClick={handleSubmit} disabled={!file || !password || isProcessing}>
          {isProcessing ? "Processando…" : copy.action}
        </Button>
      </div>

      {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}
