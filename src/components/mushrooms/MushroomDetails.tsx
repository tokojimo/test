import React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Mushroom } from "@/types";

interface Props {
  mushroom: Mushroom | null;
  open: boolean;
  onClose: () => void;
}

export default function MushroomDetails({ mushroom, open, onClose }: Props) {
  if (!mushroom) return null;
  return (
    <Modal open={open} onClose={onClose}>
      <div className="md:ml-auto md:h-full md:max-w-md md:w-full md:rounded-none overflow-y-auto">
        <img src={mushroom.photo} alt="" className="w-full aspect-[4/3] object-cover" loading="lazy" />
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-foreground">{mushroom.name}</h2>
            {mushroom.premium && <Badge variant="secondary">Premium</Badge>}
          </div>
          <p className="text-sm text-moss italic">{mushroom.latin}</p>
          <p className="text-sm text-foreground/80">{mushroom.description}</p>
          <div className="flex gap-2">
            <Button onClick={onClose}>Voir sur la carte</Button>
            <Button variant="secondary" onClick={onClose}>Ajouter à mes coins</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

