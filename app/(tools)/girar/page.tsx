import { ToolLayout } from "@/components/ToolLayout";
import { PdfWorkspace } from "@/components/PdfWorkspace";
import { ExportPdfButton } from "@/components/ExportPdfButton";

export const metadata = {
  title: "Girar PDF — DocWave",
  description: "Gire páginas de um PDF diretamente no navegador.",
};

export default function GirarPage() {
  return (
    <ToolLayout
      title="Girar PDF"
      description="Passe o mouse sobre a página e clique em ⟳ para girá-la 90°."
      actions={<ExportPdfButton />}
    >
      <PdfWorkspace />
    </ToolLayout>
  );
}
