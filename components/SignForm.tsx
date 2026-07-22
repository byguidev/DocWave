"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { signPdf } from "@/lib/pdf/sign";
import { downloadBytes } from "@/lib/download";
import { Button } from "@/components/ui/Button";
import { inputClass, dropzoneClass } from "@/lib/ui";

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
    <div {...getRootProps()} className={`min-h-28 ${dropzoneClass(isDragActive)}`}>
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
            className={inputClass}
          />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-sm">
          Motivo (opcional)
          <input
            type="text"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className={inputClass}
          />
        </label>
        <Button type="button" onClick={handleSign} disabled={!pdfFile || !p12File || isSigning}>
          {isSigning ? "Assinando…" : "Assinar e baixar"}
        </Button>
      </div>

      {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
      <p className="text-xs text-muted">
        Você precisa de um certificado digital próprio (arquivo .p12/.pfx). O DocWave não emite
        certificados nem verifica identidade — apenas aplica a assinatura criptográfica (PKCS#7) ao
        arquivo, inteiramente no seu navegador.
      </p>
    </div>
  );
}
