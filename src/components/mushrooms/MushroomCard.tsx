import React from "react";
import type { Mushroom } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface Props {
  mushroom: Mushroom;
  onSelect: () => void;
  disabled?: boolean;
}

export default function MushroomCard({ mushroom, onSelect, disabled = false }: Props) {
  const handleKey = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled) onSelect();
  };

  return (
    <a
      href="#"
      role="link"
      aria-label={mushroom.name}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onKeyDown={handleKey}
      onClick={handleClick}
        className={`h-full flex flex-col group relative rounded-lg border border-border bg-paper text-foreground shadow-sm transition hover:shadow-md focus-visible:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] hover:-translate-y-0.5 active:scale-[.99] ${disabled ? "pointer-events-none opacity-50" : ""}`}
    >
        <div className="aspect-[4/3] overflow-hidden rounded-t-lg bg-[var(--surface-2)]">
        <img
          src={mushroom.photo}
          alt={mushroom.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex grow flex-col gap-2 p-4">
        <h3 className="text-base font-medium truncate">{mushroom.name}</h3>
        {mushroom.latin && (
          <p className="text-sm text-[var(--muted-foreground)] truncate">{mushroom.latin}</p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-2">
          {mushroom.premium && <Badge variant="secondary">Premium</Badge>}
          <ChevronRight
            className="ml-auto h-4 w-4 text-foreground/40 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </div>
      </div>
    </a>
  );
}
