import React from "react";
import { Switch } from "@/components/ui/switch";
import { T_PRIMARY } from "../styles/tokens";

export function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className={T_PRIMARY}>{label}</div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
