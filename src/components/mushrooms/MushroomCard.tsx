import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Mushroom } from "@/types";

interface Props {
  mushroom: Mushroom;
  compact?: boolean;
  onView: () => void;
  onAdd: () => void;
  onDetails: () => void;
}

export default function MushroomCard({ mushroom, compact = false, onView, onAdd, onDetails }: Props) {
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onDetails();
  };
  return (
    <a
      role="link"
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onDetails();
      }}
      onKeyDown={handleKey}
      className="block h-full no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <Card className={compact ? "flex items-center gap-4 h-full" : "cursor-pointer h-full"}>
        {compact ? (
          <img
            src={mushroom.photo}
            alt=""
            className="h-24 w-32 object-cover rounded-l-lg"
            loading="lazy"
          />
        ) : (
          <img
            src={mushroom.photo}
            alt=""
            className="aspect-[4/3] w-full object-cover rounded-t-lg"
            loading="lazy"
          />
        )}
        <CardContent className={compact ? "p-4 flex-1" : "p-4 space-y-2"}>
          <div className="flex items-center gap-2">
            <CardTitle className="text-foreground text-lg font-semibold">{mushroom.name}</CardTitle>
            {mushroom.premium && <Badge variant="secondary">Premium</Badge>}
          </div>
          <p className="text-sm text-moss italic">{mushroom.latin}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button onClick={(e) => { e.stopPropagation(); onView(); }} className="text-sm py-1 px-2">
              Voir sur la carte
            </Button>
            <Button
              onClick={(e) => { e.stopPropagation(); onAdd(); }}
              variant="secondary"
              className="text-sm py-1 px-2"
            >
              Ajouter à mes coins
            </Button>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

