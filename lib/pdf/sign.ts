import "./bufferPolyfill";
import { PDFDocument } from "@cantoo/pdf-lib";
import signpdf from "@signpdf/signpdf";
import { P12Signer } from "@signpdf/signer-p12";
import { addSignaturePlaceholder } from "./signPlaceholder";

export type SignOptions = {
  p12Bytes: ArrayBuffer;
  passphrase: string;
  reason?: string;
  contactInfo?: string;
  name?: string;
  location?: string;
};

export async function signPdf(bytes: ArrayBuffer, options: SignOptions): Promise<Uint8Array> {
  const doc = await PDFDocument.load(bytes.slice(0));

  addSignaturePlaceholder({
    pdfDoc: doc,
    reason: options.reason ?? "Assinatura digital",
    contactInfo: options.contactInfo ?? "",
    name: options.name ?? "",
    location: options.location ?? "",
  });

  const pdfWithPlaceholder = Buffer.from(await doc.save({ useObjectStreams: false }));

  let signer: P12Signer;
  try {
    signer = new P12Signer(new Uint8Array(options.p12Bytes), { passphrase: options.passphrase });
  } catch {
    throw new Error("Não foi possível ler o certificado .p12 (verifique o arquivo e a senha).");
  }

  try {
    const signed = await signpdf.sign(pdfWithPlaceholder, signer);
    return new Uint8Array(signed);
  } catch {
    throw new Error("Falha ao assinar o PDF. Verifique a senha do certificado.");
  }
}
