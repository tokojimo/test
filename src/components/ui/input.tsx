import React from "react";

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const base =
    "flex h-10 w-full rounded-xl border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none dark:border-border dark:bg-secondary dark:text-foreground";
  return <input className={`${base} ${className}`} {...props} />;
}

