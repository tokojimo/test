import React from "react";

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  const base = "flex h-10 w-full rounded-xl border border-secondary bg-secondary px-3 py-2 text-sm text-primary focus:outline-none dark:border-secondary dark:bg-secondary dark:text-primary";
  return <input className={`${base} ${className}`} {...props} />;
}

