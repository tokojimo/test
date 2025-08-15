import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useT } from "@/i18n";
import type { VisitHistory } from "@/types";
import { Stars } from "@/components/common/Stars";
import { formatDate } from "@/utils";

export function LastHarvestCard({ harvest }: { harvest?: VisitHistory }) {
  const { t } = useT();
  const date = harvest ? formatDate(harvest.date) : null;
  return (
    <Card className="h-full p-4 lg:p-6 flex flex-col">
      <CardHeader className="p-0 mb-4 border-none">
        <CardTitle>{t("Dernière cueillette")}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 space-y-2 text-sm">
        {harvest ? (
          <>
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{t("Cueillette du {date}", { date })}</h3>
              <Stars value={Math.floor(harvest.rating || 0)} />
            </div>
            <p className="text-foreground/70">{harvest.note || t("Aucun champignon enregistré")}</p>
            {harvest.photos?.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {harvest.photos.map((url, i) => (
                  <img
                    key={url}
                    src={url}
                    alt={t("Photo {n}", { n: i + 1 })}
                    className="w-full h-full object-cover rounded-md border border-border aspect-square"
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-foreground/70">{t("Aucune cueillette enregistrée.")}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default LastHarvestCard;

