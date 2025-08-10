import React from "react";

export function StarRating({ value = 0, onSelectIndex }: { value?: number; onSelectIndex?: (i: number) => void }) {
  return (
    <div className="flex items-center select-none">
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = 5 - i <= value;
        return (
          <button key={i} type="button" onClick={() => onSelectIndex?.(i)} className="p-0.5" aria-label={`note ${5 - i}`}>
            <span className={filled ? "text-amber-400" : "text-neutral-600"}>★</span>
          </button>
        );
      })}
    </div>
  );
}
