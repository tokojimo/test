import React from "react";

export function Select({ className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const base =
    "h-10 w-full rounded-md border border-border bg-paper px-3 pr-8 py-2 text-sm text-foreground appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:pointer-events-none";
  return (
    <div className="relative">
      <select className={`${base} ${className}`} {...props} />
      <svg
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground opacity-70"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

