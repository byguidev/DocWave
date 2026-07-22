export type ToolColor = "blue" | "sky" | "emerald" | "teal" | "amber" | "rose" | "fuchsia";

export const toolColorClasses: Record<ToolColor, { bg: string; text: string; border: string }> = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    border: "group-hover:border-blue-300 dark:group-hover:border-blue-800",
  },
  sky: {
    bg: "bg-sky-50 dark:bg-sky-500/10",
    text: "text-sky-600 dark:text-sky-400",
    border: "group-hover:border-sky-300 dark:group-hover:border-sky-800",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "group-hover:border-emerald-300 dark:group-hover:border-emerald-800",
  },
  teal: {
    bg: "bg-teal-50 dark:bg-teal-500/10",
    text: "text-teal-600 dark:text-teal-400",
    border: "group-hover:border-teal-300 dark:group-hover:border-teal-800",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    border: "group-hover:border-amber-300 dark:group-hover:border-amber-800",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-500/10",
    text: "text-rose-600 dark:text-rose-400",
    border: "group-hover:border-rose-300 dark:group-hover:border-rose-800",
  },
  fuchsia: {
    bg: "bg-fuchsia-50 dark:bg-fuchsia-500/10",
    text: "text-fuchsia-600 dark:text-fuchsia-400",
    border: "group-hover:border-fuchsia-300 dark:group-hover:border-fuchsia-800",
  },
};
