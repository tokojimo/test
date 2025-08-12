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
      className={`relative inline-flex h-6 w-10 items-center rounded-full border transition-colors ${
        checked
          ? "border-primary bg-primary dark:border-primary dark:bg-primary"
          : "border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800"
      } ${className}`}
      {...props}
    >
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full bg-white dark:bg-white border border-border shadow transition-transform ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

