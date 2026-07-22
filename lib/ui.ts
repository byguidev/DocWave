export const inputClass =
  "rounded-lg border border-border bg-surface px-3 py-2 text-foreground transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

export function dropzoneClass(isDragActive: boolean) {
  return `flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
    isDragActive
      ? "border-brand bg-brand-soft"
      : "border-border hover:border-brand/60 hover:bg-brand-soft/40"
  }`;
}
