import { ToolLayout } from "@/components/ToolLayout";
import { MergeWorkspace } from "@/components/MergeWorkspace";

export const metadata = {
  title: "Mesclar PDFs — DocWave",
  description: "Combine vários arquivos PDF em um só, diretamente no navegador.",
};

export default function MesclarPage() {
  return (
    <ToolLayout
      title="Mesclar PDFs"
      description="Envie dois ou mais arquivos, ordene-os e baixe um único PDF combinado."
    >
      <MergeWorkspace />
    </ToolLayout>
  );
}
