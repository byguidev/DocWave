import { ToolLayout } from "@/components/ToolLayout";
import { PdfWorkspace } from "@/components/PdfWorkspace";
import { PdfToTextButton } from "@/components/PdfToTextButton";

export const metadata = {
  title: "PDF para texto — DocWave",
  description: "Extraia o texto de um PDF para um arquivo .docx, diretamente no navegador.",
};

export default function PdfParaTextoPage() {
  return (
    <ToolLayout
      title="PDF para texto"
      description="Envie um PDF e baixe um .docx com o texto extraído (sem reconstrução de layout, tabelas ou imagens)."
      actions={<PdfToTextButton />}
    >
      <PdfWorkspace />
    </ToolLayout>
  );
}
