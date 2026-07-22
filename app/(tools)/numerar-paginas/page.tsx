import { ToolLayout } from "@/components/ToolLayout";
import { PdfWorkspace } from "@/components/PdfWorkspace";
import { PageNumbersForm } from "@/components/PageNumbersForm";

export const metadata = {
  title: "Numerar páginas do PDF — DocWave",
  description: "Adicione numeração de páginas a um PDF diretamente no navegador.",
};

export default function NumerarPaginasPage() {
  return (
    <ToolLayout
      title="Numerar páginas"
      description="Envie um PDF, escolha a posição e baixe com a numeração aplicada em todas as páginas."
    >
      <PdfWorkspace />
      <PageNumbersForm />
    </ToolLayout>
  );
}
