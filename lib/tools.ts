import {
  LayoutGrid,
  Combine,
  Scissors,
  RotateCw,
  Shrink,
  Droplet,
  ListOrdered,
  Image,
  FileImage,
  FileText,
  ScanText,
  Lock,
  LockOpen,
  Signature,
  type LucideIcon,
} from "lucide-react";
import type { ToolColor } from "./toolColors";

export type Tool = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: ToolColor;
};

export const tools: Tool[] = [
  { href: "/organizar", title: "Organizar PDF", description: "Reordene, gire e remova páginas", icon: LayoutGrid, color: "sky" },
  { href: "/mesclar", title: "Mesclar PDFs", description: "Combine vários arquivos em um só", icon: Combine, color: "blue" },
  { href: "/dividir", title: "Dividir PDF", description: "Separe páginas em arquivos individuais", icon: Scissors, color: "blue" },
  { href: "/girar", title: "Girar PDF", description: "Gire páginas em 90°", icon: RotateCw, color: "sky" },
  { href: "/comprimir", title: "Comprimir PDF", description: "Reduza o tamanho do arquivo", icon: Shrink, color: "fuchsia" },
  { href: "/marca-dagua", title: "Marca d'água", description: "Adicione texto sobre todas as páginas", icon: Droplet, color: "amber" },
  { href: "/numerar-paginas", title: "Numerar páginas", description: "Adicione numeração automática", icon: ListOrdered, color: "amber" },
  { href: "/pdf-para-imagem", title: "PDF para imagem", description: "Exporte páginas como PNG", icon: Image, color: "teal" },
  { href: "/imagem-para-pdf", title: "Imagem para PDF", description: "Combine imagens em um PDF", icon: FileImage, color: "teal" },
  { href: "/pdf-para-texto", title: "PDF para texto", description: "Extraia o texto para .docx", icon: FileText, color: "emerald" },
  { href: "/ocr", title: "OCR", description: "Reconheça texto em PDFs escaneados", icon: ScanText, color: "emerald" },
  { href: "/proteger", title: "Proteger PDF", description: "Adicione uma senha ao arquivo", icon: Lock, color: "rose" },
  { href: "/remover-senha", title: "Remover senha", description: "Remova a senha de um PDF protegido", icon: LockOpen, color: "rose" },
  { href: "/assinar", title: "Assinar PDF", description: "Aplique uma assinatura digital (PKCS#7)", icon: Signature, color: "fuchsia" },
];
