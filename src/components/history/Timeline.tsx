import React from "react";

export type TimelineEvent = {
  id: string;
  date: string;
  rating: number;
  label: string;
};

export function Timeline({ events, onSelect }: { events: TimelineEvent[]; onSelect: (id: string) => void }) {
  return (
    <div className="space-y-2">
      {events.map(ev => (
        <button
          key={ev.id}
          onClick={() => onSelect(ev.id)}
          className="flex items-center w-full h-12 px-4 rounded-md text-left hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <div className="flex flex-col">
            <span className="text-sm">{ev.date}</span>
            <span className="text-xs text-foreground/70">Note: {ev.rating}/5{ev.label ? ` • ${ev.label}` : ""}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

export default Timeline;
