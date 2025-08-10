import React from "react";
import { T_PRIMARY, T_MUTED } from "../styles/tokens";

export function InfoBlock({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3">
      <div className={`flex items-center gap-2 mb-1 ${T_PRIMARY}`}>
        <div className="w-6 h-6 grid place-items-center rounded-lg bg-neutral-800 text-neutral-100">{icon}</div>
        <div className="text-sm font-medium">{title}</div>
      </div>
      <div className={`text-sm ${T_MUTED}`}>{text}</div>
    </div>
  );
}
