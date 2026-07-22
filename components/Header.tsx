import Link from "next/link";
import { Waves } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border/80 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-foreground">
            <Waves className="h-5 w-5" strokeWidth={2.25} />
          </span>
          DocWave
        </Link>
        <nav className="text-sm">
          <Link href="/" className="text-muted transition-colors hover:text-foreground">
            Todas as ferramentas
          </Link>
        </nav>
      </div>
    </header>
  );
}
