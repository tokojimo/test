import React from "react";

interface ProgressProps {
  value?: number;
  className?: string;
}

export function Progress({ value = 0, className = "" }: ProgressProps) {
  return (
    <div className={`w-full h-2 rounded-full bg-secondary dark:bg-secondary ${className}`}>
      <div
        className="h-2 rounded-full bg-primary dark:bg-primary transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
