import React from "react";

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export function Switch({ checked = false, onCheckedChange, className = "" }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={`relative inline-flex h-6 w-10 items-center rounded-full border border-neutral-300 bg-neutral-200 transition-colors dark:border-neutral-700 dark:bg-neutral-800 ${checked ? "bg-neutral-700 dark:bg-neutral-300" : ""} ${className}`}
    >
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow transform transition-transform dark:bg-neutral-900 ${checked ? "translate-x-4" : "translate-x-0"}`}
      />
    </button>
  );
}

