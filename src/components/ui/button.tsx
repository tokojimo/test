import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "default" | "icon";
}

export function Button({
  variant = "primary",
  size = "default",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none";
  const disabledStyles =
    "disabled:bg-neutral-200 disabled:text-neutral-400 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-400";
  const variants = {
    primary:
      "bg-forest text-paper hover:bg-moss",
    secondary:
      "bg-moss text-paper hover:bg-fern",
    ghost:
      "bg-transparent text-foreground hover:bg-foreground/10",
    destructive:
      "bg-danger text-paper hover:bg-danger/80",
  } as const;
  const sizes = {
    default: "px-4 py-2 text-sm",
    icon: "h-10 w-10 p-0",
  } as const;
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`;
  return <button className={classes} {...props} />;
}

