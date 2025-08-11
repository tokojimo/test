import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary";
}

export function Badge({ variant = "default", className = "", ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium";
  const variants = {
    default:
      "border-border bg-secondary text-foreground dark:border-border dark:bg-secondary dark:text-foreground",
    secondary:
      "border-border bg-primary text-white dark:border-border dark:bg-primary dark:text-white",
  } as const;
  return <span className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

