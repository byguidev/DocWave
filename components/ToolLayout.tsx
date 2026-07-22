"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { tools } from "@/lib/tools";
import { toolColorClasses } from "@/lib/toolColors";

type ToolLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
};

export function ToolLayout({ title, description, children, actions }: ToolLayoutProps) {
  const pathname = usePathname();
  const tool = tools.find((t) => t.href === pathname);
  const colors = tool ? toolColorClasses[tool.color] : null;
  const Icon = tool?.icon;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-6">
        <Link
          href="/"
          className="flex w-fit items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Todas as ferramentas
        </Link>
        <header className="flex items-center gap-4">
          {Icon && colors && (
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colors.bg} ${colors.text}`}>
              <Icon className="h-6 w-6" strokeWidth={2} />
            </span>
          )}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-muted">{description}</p>
          </div>
        </header>
      </div>

      <div className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-6 shadow-sm">
        {children}
        {actions && <div className="flex justify-end gap-3">{actions}</div>}
      </div>
    </main>
  );
}
