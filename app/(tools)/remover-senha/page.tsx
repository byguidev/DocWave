import { ToolLayout } from "@/components/ToolLayout";
import { PasswordToolForm } from "@/components/PasswordToolForm";

export const metadata = {
  title: "Remover senha de PDF — DocWave",
  description: "Remova a senha de um PDF protegido, diretamente no navegador.",
};

export default function RemoverSenhaPage() {
  return (
    <ToolLayout
      title="Remover senha"
      description="Envie um PDF protegido, informe a senha atual e baixe a versão sem senha."
    >
      <PasswordToolForm mode="unlock" />
    </ToolLayout>
  );
}
