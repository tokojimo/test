import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
  size?: "default" | "icon";
}

export function Button({ variant = "default", size = "default", className = "", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus:outline-none disabled:opacity-50";
  const variants = {
    default: "bg-secondary text-primary hover:bg-secondary/80 dark:bg-secondary dark:text-primary dark:hover:bg-secondary/60",
    ghost: "bg-transparent hover:bg-secondary dark:hover:bg-secondary",
  } as const;
  const sizes = {
    default: "px-3 py-2",
    icon: "h-10 w-10 p-0",
  } as const;
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  return <button className={classes} {...props} />;
}

