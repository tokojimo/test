import React from "react";

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  selected?: boolean;
}

export function Chip({ selected = false, className = "", ...props }: ChipProps) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
  const variant = selected
    ? "bg-forest text-paper"
    : "bg-foreground/10 text-foreground hover:bg-foreground/20";
  return <span className={`${base} ${variant} ${className}`} {...props} />;
}

