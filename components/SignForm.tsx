"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { signPdf } from "@/lib/pdf/sign";
import { downloadBytes } from "@/lib/download";

function FileField({
  label,
  file,
  accept,
  onDrop,
}: {
  label: string;
  file: File | null;
  accept: Record<string, string[]>;
  onDrop: (files: File[]) => void;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept, multiple: false });
  return (
    <div
      {...getRootProps()}
      className={`flex min-h-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed p-4 text-center transition-colors ${
        isDragActive
          ? "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-900"
          : "border-zinc-300 dark:border-zinc-700"
      }`}
    >
      <input {...getInputProps()} />
      <p className="text-sm font-medium">{file ? file.name : label}</p>
    </div>
  );
}

export function SignForm() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [p12File, setP12File] = useState<File | null>(null);
  const [passphrase, setPassphrase] = useState("");
  const [reason, setReason] = useState("");
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDropPdf = useCallback((files: File[]) => {
    setPdfFile(files[0] ?? null);
    setError(null);
  }, []);
  const onDropP12 = useCallback((files: File[]) => {
    setP12File(files[0] ?? null);
    setError(null);
  }, []);

  const handleSign = async () => {
    if (!pdfFile || !p12File) return;
    setIsSigning(true);
    setError(null);
    try {
      const [pdfBytes, p12Bytes] = await Promise.all([pdfFile.arrayBuffer(), p12File.arrayBuffer()]);
      const signed = await signPdf(pdfBytes, { p12Bytes, passphrase, reason: reason || undefined });
      downloadBytes(signed, pdfFile.name.replace(/\.pdf$/i, "") + "-assinado.pdf");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível assinar o PDF.");
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FileField
          label="Arraste o PDF a assinar"
          file={pdfFile}
          accept={{ "application/pdf": [".pdf"] }}
          onDrop={onDropPdf}
        />
        <FileField
          label="Arraste seu certificado (.p12/.pfx)"
          file={p12File}
          accept={{ "application/x-pkcs12": [".p12", ".pfx"] }}
          onDrop={onDropP12}
        />
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Senha do certificado
          <input
            type="password"
            value={passphrase}
            onChange={(event) => setPassphrase(event.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Motivo (opcional)
          <input
            type="text"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <button
          type="button"
          onClick={handleSign}
          disabled={!pdfFile || !p12File || isSigning}
          className="rounded-lg bg-zinc-900 px-5 py-2.5 font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {isSigning ? "Assinando…" : "Assinar e baixar"}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <p className="text-xs text-zinc-500">
        Você precisa de um certificado digital próprio (arquivo .p12/.pfx). O DocWave não emite
        certificados nem verifica identidade — apenas aplica a assinatura criptográfica (PKCS#7) ao
        arquivo, inteiramente no seu navegador.
      </p>
    </div>
  );
}
