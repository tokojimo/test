import React from "react";

export function Select({ className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const base =
    "h-10 w-full rounded-md border border-border bg-paper px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:pointer-events-none";
  return <select className={`${base} ${className}`} {...props} />;
}

