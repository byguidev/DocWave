import { ToolLayout } from "@/components/ToolLayout";
import { ImageToPdfWorkspace } from "@/components/ImageToPdfWorkspace";

export const metadata = {
  title: "Imagem para PDF — DocWave",
  description: "Combine imagens PNG ou JPG em um único PDF, diretamente no navegador.",
};

export default function ImagemParaPdfPage() {
  return (
    <ToolLayout
      title="Imagem para PDF"
      description="Envie imagens, ordene-as e baixe um PDF com uma página por imagem."
    >
      <ImageToPdfWorkspace />
    </ToolLayout>
  );
}
