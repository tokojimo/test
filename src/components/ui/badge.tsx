import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary";
}

export function Badge({ variant = "default", className = "", ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium";
  const variants = {
    default: "border-secondary bg-secondary text-primary dark:border-secondary dark:bg-secondary dark:text-primary",
    secondary: "border-secondary bg-primary text-secondary dark:border-secondary dark:bg-primary dark:text-secondary",
  } as const;
  return <span className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

