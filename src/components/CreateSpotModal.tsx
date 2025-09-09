import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MUSHROOMS } from "../data/mushrooms";
import { BTN, T_PRIMARY } from "../styles/tokens";
import { useT } from "../i18n";
import type { Spot } from "../types";
import { todayISO } from "../utils";
import { CoinFormBase, CoinFormValues } from "./CoinFormBase";
import LocationSection from "./LocationSection";

export function CreateSpotModal({ onClose, onCreate }: { onClose: () => void; onCreate: (spot: Spot) => void }) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const { t } = useT();
  const [name, setName] = useState(() => t("Mon nouveau coin"));
  const [location, setLocation] = useState("");
  const [values, setValues] = useState<CoinFormValues>({
    species: ["cepe_de_bordeaux"],
    date: todayISO(),
    rating: 4,
    photos: [],
  });

  const handleOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  const create = () => {
    const cover = values.photos[0] || MUSHROOMS[0].photo;
    const history = [
      { id: crypto.randomUUID(), date: values.date, rating: values.rating, note: t("Création"), photos: values.photos.slice(0, 3), species: values.species },
    ];
    onCreate({
      id: Date.now(),
      name,
      species: values.species,
      rating: values.rating,
      last: values.date,
      location,
      cover,
      photos: values.photos.length ? values.photos : [cover],
      history,
    });
  };

  return (
    <div ref={overlayRef} onClick={handleOutside} className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-3">
      <div className="w-full max-w-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`text-lg font-semibold ${T_PRIMARY}`}>{t("Nouveau coin")}</div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("Nom du coin")}
            className={T_PRIMARY}
          />
          <LocationSection location={location} onChange={setLocation} />
          <CoinFormBase values={values} onChange={setValues} />
          <div className="flex items-center gap-2 justify-end">
            <Button
              variant="ghost"
              onClick={onClose}
              className={`rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-800 ${T_PRIMARY}`}
            >
              {t("Annuler")}
            </Button>
            <Button className={BTN} onClick={create}>
              {t("Créer")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateSpotModal;
