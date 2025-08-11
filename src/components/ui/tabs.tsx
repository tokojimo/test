import React from "react";

type Tab = { id: string; label: string };

export function Tabs({ tabs, active, onChange }: { tabs: Tab[]; active: string; onChange: (id: string) => void }) {
  return (
    <div className="flex gap-2">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            active === t.id ? "bg-forest text-paper" : "bg-transparent text-foreground hover:bg-foreground/10"
          }`}
          onClick={() => onChange(t.id)}
          role="tab"
          aria-selected={active === t.id}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

