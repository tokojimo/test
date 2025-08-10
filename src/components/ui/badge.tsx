import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary";
}

export function Badge({ variant = "default", className = "", ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium";
  const variants = {
    default: "border-neutral-300 bg-neutral-200 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100",
    secondary: "border-neutral-300 bg-neutral-300 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-700 dark:text-neutral-100",
  } as const;
  return <span className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

