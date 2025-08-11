import React from "react";

interface ProgressProps {
  value?: number;
  className?: string;
}

export function Progress({ value = 0, className = "" }: ProgressProps) {
  return (
    <div className={`w-full h-2 rounded-full bg-secondary dark:bg-secondary overflow-hidden ${className}`}>
      <div
        className="h-full rounded-full bg-primary dark:bg-primary transition-transform will-change-transform origin-left"
        style={{ transform: `scaleX(${Math.min(1, Math.max(0, value / 100))})` }}
      />
    </div>
  );
}

