import React from "react";
import { T_PRIMARY, T_MUTED } from "../styles/tokens";

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className={`text-sm ${T_PRIMARY}`}>{label}</div>
      <div className={`text-sm ${T_MUTED}`}>{value}</div>
    </div>
  );
}
