import Link from "next/link";
import { ShieldCheck, Zap } from "lucide-react";
import { tools } from "@/lib/tools";
import { toolColorClasses } from "@/lib/toolColors";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-14 px-6 py-16 sm:py-24">
      <header className="flex flex-col items-center gap-5 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand">
          <ShieldCheck className="h-4 w-4" />
          100% no seu navegador
        </span>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Ferramentas de PDF, sem enviar nada para servidor
        </h1>
        <p className="max-w-xl text-lg text-muted">
          Mescle, divida, converta, proteja e assine seus PDFs. Nenhum arquivo sai do seu
          dispositivo — sem cadastro, sem espera.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const colors = toolColorClasses[tool.color];
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className={`group flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${colors.border}`}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors.bg} ${colors.text}`}
              >
                <Icon className="h-6 w-6" strokeWidth={2} />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="font-medium">{tool.title}</span>
                <span className="text-sm text-muted">{tool.description}</span>
              </span>
            </Link>
          );
        })}
      </div>

      <footer className="flex flex-col items-center gap-2 text-center text-sm text-muted">
        <span className="flex items-center gap-1.5">
          <Zap className="h-4 w-4 text-brand" />
          Processamento instantâneo, direto no navegador
        </span>
      </footer>
    </main>
  );
}
