import React from "react";
import { T_PRIMARY } from "../styles/tokens";

export function SelectRow({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className={T_PRIMARY}>{label}</div>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
