import { ToolLayout } from "@/components/ToolLayout";
import { PdfWorkspace } from "@/components/PdfWorkspace";
import { CompressForm } from "@/components/CompressForm";

export const metadata = {
  title: "Comprimir PDF — DocWave",
  description: "Reduza o tamanho de um PDF recomprimindo suas páginas, diretamente no navegador.",
};

export default function ComprimirPage() {
  return (
    <ToolLayout
      title="Comprimir PDF"
      description="Envie um PDF, escolha o nível de compressão e baixe uma versão menor."
    >
      <PdfWorkspace />
      <CompressForm />
    </ToolLayout>
  );
}
