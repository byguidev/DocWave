import { ToolLayout } from "@/components/ToolLayout";
import { PdfWorkspace } from "@/components/PdfWorkspace";
import { PdfToImagesButton } from "@/components/PdfToImagesButton";

export const metadata = {
  title: "PDF para imagem — DocWave",
  description: "Converta cada página de um PDF em uma imagem PNG, diretamente no navegador.",
};

export default function PdfParaImagemPage() {
  return (
    <ToolLayout
      title="PDF para imagem"
      description="Envie um PDF e baixe cada página como PNG (uma imagem, ou um .zip se houver mais de uma página)."
      actions={<PdfToImagesButton />}
    >
      <PdfWorkspace />
    </ToolLayout>
  );
}
