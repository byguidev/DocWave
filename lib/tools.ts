export type Tool = {
  href: string;
  title: string;
  description: string;
};

export const tools: Tool[] = [
  { href: "/organizar", title: "Organizar PDF", description: "Reordene, gire e remova páginas" },
  { href: "/mesclar", title: "Mesclar PDFs", description: "Combine vários arquivos em um só" },
  { href: "/dividir", title: "Dividir PDF", description: "Separe páginas em arquivos individuais" },
  { href: "/girar", title: "Girar PDF", description: "Gire páginas em 90°" },
  { href: "/comprimir", title: "Comprimir PDF", description: "Reduza o tamanho do arquivo" },
  { href: "/marca-dagua", title: "Marca d'água", description: "Adicione texto sobre todas as páginas" },
  { href: "/numerar-paginas", title: "Numerar páginas", description: "Adicione numeração automática" },
  { href: "/pdf-para-imagem", title: "PDF para imagem", description: "Exporte páginas como PNG" },
  { href: "/imagem-para-pdf", title: "Imagem para PDF", description: "Combine imagens em um PDF" },
  { href: "/pdf-para-texto", title: "PDF para texto", description: "Extraia o texto para .docx" },
  { href: "/ocr", title: "OCR", description: "Reconheça texto em PDFs escaneados" },
  { href: "/proteger", title: "Proteger PDF", description: "Adicione uma senha ao arquivo" },
  { href: "/remover-senha", title: "Remover senha", description: "Remova a senha de um PDF protegido" },
  { href: "/assinar", title: "Assinar PDF", description: "Aplique uma assinatura digital (PKCS#7)" },
];
