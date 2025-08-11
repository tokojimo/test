import React from 'react';

type Item = { id: string; label: string; content: React.ReactNode };

export function Accordion({ items, value, onChange }: { items: Item[]; value: string; onChange: (id: string) => void }) {
  return (
    <div className="space-y-2">
      {items.map((it) => (
        <details
          key={it.id}
          open={value === it.id}
          onToggle={(e) => {
            if (e.currentTarget.open) onChange(it.id);
          }}
          className="border border-border rounded-md"
        >
          <summary className="cursor-pointer px-4 py-2 text-sm font-medium text-foreground">
            {it.label}
          </summary>
          <div className="px-4 py-2">
            {it.content}
          </div>
        </details>
      ))}
    </div>
  );
}

export default Accordion;
