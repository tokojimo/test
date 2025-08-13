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
          className="flex w-full items-center gap-4 h-12 px-4 rounded-md text-left text-sm hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span className="flex-1">{ev.date}</span>
          <span className="w-12 text-center">{ev.rating}</span>
          <span className="flex-1">{ev.label}</span>
        </button>
      ))}
    </div>
  );
}

export default Timeline;
