import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/80">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 py-8 text-center text-sm text-muted sm:flex-row sm:justify-between sm:text-left">
        <span>© {new Date().getFullYear()} DocWave</span>
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-brand" />
          Seus arquivos nunca saem do navegador
        </span>
      </div>
    </footer>
  );
}
