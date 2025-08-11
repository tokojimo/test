import React from "react";
import { T_PRIMARY } from "../styles/tokens";
import { Select } from "./ui/select";

export function SelectRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className={T_PRIMARY}>{label}</div>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
