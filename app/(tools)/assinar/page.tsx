import { ToolLayout } from "@/components/ToolLayout";
import { SignForm } from "@/components/SignForm";

export const metadata = {
  title: "Assinar PDF digitalmente — DocWave",
  description: "Aplique uma assinatura digital (PKCS#7) a um PDF usando seu próprio certificado, no navegador.",
};

export default function AssinarPage() {
  return (
    <ToolLayout
      title="Assinar PDF"
      description="Envie o PDF e seu certificado digital (.p12/.pfx) para aplicar uma assinatura criptográfica real."
    >
      <SignForm />
    </ToolLayout>
  );
}
