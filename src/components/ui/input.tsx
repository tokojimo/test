import React from "react";

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const base = "flex h-10 w-full rounded-xl border border-neutral-300 bg-neutral-100 px-3 py-2 text-sm text-neutral-900 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100";
  return <input className={`${base} ${className}`} {...props} />;
}

