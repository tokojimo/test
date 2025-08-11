import React from "react";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => {
    const base =
      "flex h-10 w-full rounded-md border border-border bg-paper px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:pointer-events-none";
    return <input ref={ref} className={`${base} ${className}`} {...props} />;
  }
);

Input.displayName = "Input";

