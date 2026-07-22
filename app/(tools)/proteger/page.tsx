import { ToolLayout } from "@/components/ToolLayout";
import { PasswordToolForm } from "@/components/PasswordToolForm";

export const metadata = {
  title: "Proteger PDF com senha — DocWave",
  description: "Adicione uma senha a um PDF diretamente no navegador.",
};

export default function ProtegerPage() {
  return (
    <ToolLayout
      title="Proteger PDF"
      description="Envie um PDF, defina uma senha e baixe a versão protegida."
    >
      <PasswordToolForm mode="protect" />
    </ToolLayout>
  );
}
