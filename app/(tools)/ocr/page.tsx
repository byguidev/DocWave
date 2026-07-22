import { ToolLayout } from "@/components/ToolLayout";
import { PdfWorkspace } from "@/components/PdfWorkspace";
import { OcrForm } from "@/components/OcrForm";

export const metadata = {
  title: "OCR de PDF — DocWave",
  description: "Reconheça texto em PDFs escaneados (português e inglês), diretamente no navegador.",
};

export default function OcrPage() {
  return (
    <ToolLayout
      title="OCR"
      description="Envie um PDF escaneado e baixe um .docx com o texto reconhecido por OCR."
    >
      <PdfWorkspace />
      <OcrForm />
    </ToolLayout>
  );
}
