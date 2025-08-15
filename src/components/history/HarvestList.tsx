import React from "react";
import { Button } from "@/components/ui/button";
import type { VisitHistory } from "@/types";
import { useT } from "@/i18n";
import { Stars } from "@/components/common/Stars";
import { formatDate } from "@/utils";

interface HarvestListProps {
  items: VisitHistory[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function HarvestList({ items, onEdit, onDelete }: HarvestListProps) {
  const { t } = useT();

  return (
    <ul className="space-y-4">
      {items.map((h) => {
        const date = formatDate(h.date);
        return (
          <li key={h.id}>
            <div
              tabIndex={0}
              role="button"
              className="p-4 border border-border rounded-md space-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              onClick={() => onEdit(h.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onEdit(h.id);
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">{t("Cueillette du {date}", { date })}</h3>
                <Stars value={Math.floor(h.rating || 0)} />
              </div>
              <p className="text-sm text-foreground/70">{h.note || t("Aucun champignon enregistré")}</p>
              {h.photos?.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {h.photos.map((url, idx) => (
                    <img
                      key={url}
                      src={url}
                      alt={t("Photo {n}", { n: idx + 1 })}
                      className="w-full h-full object-cover rounded-md border border-border aspect-square"
                    />
                  ))}
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={(e) => { e.stopPropagation(); onEdit(h.id); }}>
                  {t("Modifier la cueillette")}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-danger border border-danger hover:bg-danger/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(t("Supprimer cette cueillette ?"))) onDelete(h.id);
                  }}
                >
                  {t("Supprimer")}
                </Button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default HarvestList;

