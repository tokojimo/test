import React from "react";

export function Stars({ value }: { value: number }) {
  return (
    <div className="flex text-gold" aria-label={`note ${value} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < value ? "" : "text-foreground/20"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default Stars;
