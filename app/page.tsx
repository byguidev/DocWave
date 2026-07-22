import Link from "next/link";
import { tools } from "@/lib/tools";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-16">
      <header className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">DocWave</h1>
        <p className="max-w-xl text-zinc-600 dark:text-zinc-400">
          Ferramentas de PDF que rodam 100% no seu navegador. Nenhum arquivo é enviado para
          servidor — sem cadastro, sem espera.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="flex flex-col gap-1 rounded-xl border border-zinc-200 p-5 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            <span className="font-medium">{tool.title}</span>
            <span className="text-sm text-zinc-500">{tool.description}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
