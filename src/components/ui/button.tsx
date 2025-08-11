import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
  size?: "default" | "icon";
}

export function Button({ variant = "default", size = "default", className = "", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus:outline-none disabled:opacity-50";
  const variants = {
    default: "bg-primary text-white hover:bg-primary/90 dark:bg-primary dark:text-white dark:hover:bg-primary/80",
    ghost: "bg-transparent text-primary hover:bg-primary/10 dark:text-primary dark:hover:bg-primary/20",
  } as const;
  const sizes = {
    default: "px-3 py-2",
    icon: "h-10 w-10 p-0",
  } as const;
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  return <button className={classes} {...props} />;
}

