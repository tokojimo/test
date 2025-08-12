import React from "react";
import { Chip } from "@/components/ui/chip";

export interface SpeciesOption {
  id: string;
  label: string;
  count: number;
}

interface SpeciesPickerProps {
  options: SpeciesOption[];
  selected: string[];
  onToggle: (id: string) => void;
}

export default function SpeciesPicker({ options, selected, onToggle }: SpeciesPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = selected.includes(opt.id);
        return (
          <Chip
            key={opt.id}
            selected={active}
            onClick={() => onToggle(opt.id)}
            role="checkbox"
            aria-checked={active}
          >
            {opt.label}
            <span className="ml-1 text-xs text-foreground/70">{opt.count}</span>
          </Chip>
        );
      })}
    </div>
  );
}

