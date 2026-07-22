"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { protectPdf } from "@/lib/pdf/protect";
import { unlockPdf } from "@/lib/pdf/unlock";
import { downloadBytes } from "@/lib/download";

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
      <div
        {...getRootProps()}
        className={`flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive
            ? "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-900"
            : "border-zinc-300 dark:border-zinc-700"
        }`}
      >
        <input {...getInputProps()} />
        <p className="font-medium">
          {file ? file.name : "Arraste um PDF aqui ou clique para selecionar"}
        </p>
        <p className="text-sm text-zinc-500">O arquivo não sai do seu navegador.</p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          {copy.passwordLabel}
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!file || !password || isProcessing}
          className="rounded-lg bg-zinc-900 px-5 py-2.5 font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {isProcessing ? "Processando…" : copy.action}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
