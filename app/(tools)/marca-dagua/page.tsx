import { ToolLayout } from "@/components/ToolLayout";
import { PdfWorkspace } from "@/components/PdfWorkspace";
import { WatermarkForm } from "@/components/WatermarkForm";

export const metadata = {
  title: "Marca d'água em PDF — DocWave",
  description: "Adicione uma marca d'água de texto em todas as páginas de um PDF.",
};

export default function MarcaDaguaPage() {
  return (
    <ToolLayout
      title="Marca d'água"
      description="Envie um PDF, escolha o texto e baixe com a marca d'água aplicada em todas as páginas."
    >
      <PdfWorkspace />
      <WatermarkForm />
    </ToolLayout>
  );
}
