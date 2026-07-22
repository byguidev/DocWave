import { ToolLayout } from "@/components/ToolLayout";
import { PdfWorkspace } from "@/components/PdfWorkspace";
import { SplitPdfButton } from "@/components/SplitPdfButton";

export const metadata = {
  title: "Dividir PDF — DocWave",
  description: "Separe um PDF em arquivos individuais por página, diretamente no navegador.",
};

export default function DividirPage() {
  return (
    <ToolLayout
      title="Dividir PDF"
      description="Remova as páginas que não quer dividir e baixe o restante como arquivos separados."
      actions={<SplitPdfButton />}
    >
      <PdfWorkspace />
    </ToolLayout>
  );
}
