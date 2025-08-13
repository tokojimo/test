import React from "react";

interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export function Switch({
  checked = false,
  onCheckedChange,
  className = "",
  id,
  ...props
}: SwitchProps) {
  const toggle = () => onCheckedChange?.(!checked);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={toggle}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      className={`relative inline-flex h-6 w-10 items-center rounded-full border-2 transition-colors duration-normal ease-in-out ${
        checked
          ? "bg-primary dark:bg-primary"
          : "bg-neutral-100 dark:bg-neutral-800"
      } border-border dark:border-border ${className}`}
      {...props}
    >
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full bg-white dark:bg-white border-2 border-border shadow transition-transform duration-normal ease-in-out ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

