import React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Mushroom } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { todayISO } from "@/utils";
import { useT } from "@/i18n";

interface Props {
  mushroom: Mushroom | null;
  open: boolean;
  onClose: () => void;
}

export default function MushroomDetails({ mushroom, open, onClose }: Props) {
  const { dispatch } = useAppContext();
  const { t } = useT();

  if (!mushroom) return null;

  const addSpot = () => {
    const today = todayISO();
    dispatch({
      type: "addSpot",
      spot: {
        id: Date.now(),
        cover: mushroom.photo,
        photos: [mushroom.photo],
        name: mushroom.name,
        species: [mushroom.id],
        rating: 5,
        last: today,
        history: [
          { date: today, rating: 5, note: t("Créé"), photos: [mushroom.photo] },
        ],
      },
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="md:ml-auto md:h-full md:max-w-md md:w-full md:rounded-none overflow-y-auto">
        <img src={mushroom.photo} alt="" className="w-full aspect-[4/3] object-cover" loading="lazy" />
        <div className="p-4 space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-foreground">{mushroom.name}</h2>
              {mushroom.premium && <Badge variant="secondary">Premium</Badge>}
            </div>
            <p className="mt-1 truncate text-sm italic text-[var(--muted-foreground)]">{mushroom.latin}</p>
          </div>
          <p className="text-sm text-foreground/80">{mushroom.description}</p>
          <div className="flex gap-2">
            <Button onClick={onClose}>Voir sur la carte</Button>
            <Button variant="secondary" onClick={addSpot}>Ajouter à mes coins</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

