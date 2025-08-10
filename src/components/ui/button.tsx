import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
  size?: "default" | "icon";
}

export function Button({ variant = "default", size = "default", className = "", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus:outline-none disabled:opacity-50";
  const variants = {
    default: "bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600",
    ghost: "bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800",
  } as const;
  const sizes = {
    default: "px-3 py-2",
    icon: "h-10 w-10 p-0",
  } as const;
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  return <button className={classes} {...props} />;
}

