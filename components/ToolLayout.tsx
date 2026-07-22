import type { ReactNode } from "react";

type ToolLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  actions?: ReactNode;
};

export function ToolLayout({ title, description, children, actions }: ToolLayoutProps) {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-zinc-600 dark:text-zinc-400">{description}</p>
      </header>
      {children}
      {actions && <footer className="flex justify-end gap-3">{actions}</footer>}
    </main>
  );
}
