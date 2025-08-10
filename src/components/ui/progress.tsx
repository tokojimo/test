import React from "react";

interface ProgressProps {
  value?: number;
  className?: string;
}

export function Progress({ value = 0, className = "" }: ProgressProps) {
  return (
    <div className={`w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 ${className}`}>
      <div
        className="h-2 rounded-full bg-neutral-900 dark:bg-neutral-100 transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

