import { ToolLayout } from "@/components/ToolLayout";
import { PdfWorkspace } from "@/components/PdfWorkspace";

export const metadata = {
  title: "Organizar PDF — DocWave",
  description: "Reordene, gire e remova páginas de um PDF diretamente no navegador.",
};

export default function OrganizarPage() {
  return (
    <ToolLayout
      title="Organizar PDF"
      description="Arraste para reordenar, gire ou remova páginas. Nada é enviado para nenhum servidor."
    >
      <PdfWorkspace />
    </ToolLayout>
  );
}
