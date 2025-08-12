import React from "react";
import { T_PRIMARY, T_MUTED } from "../styles/tokens";

export function InfoBlock({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3 shadow-sm">
      <div className={`mb-1 flex items-center gap-2 ${T_PRIMARY}`}>
        <div className="grid h-6 w-6 place-items-center rounded-md bg-foreground/10 text-foreground">
          {icon}
        </div>
        <div className="text-sm font-medium">{title}</div>
      </div>
      <div className={`text-sm ${T_MUTED}`}>{text}</div>
    </div>
  );
}
