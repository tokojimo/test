import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n";
import { BTN, T_PRIMARY } from "@/styles/tokens";
import CoinFormBase from "../CoinFormBase";
import { todayISO } from "@/utils";

export type Harvest = {
  id?: string;
  date: string;
  rating: number;
  species: string[];
  photos: string[];
};

export function HarvestModal({
  open,
  onClose,
  onSave,
  onDelete,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (h: Harvest) => void;
  onDelete?: () => void;
  initial?: Harvest;
}) {
  const { t } = useT();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [date, setDate] = useState(initial?.date || todayISO());
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [species, setSpecies] = useState<string[]>(initial?.species || []);
  const [photos, setPhotos] = useState<string[]>(initial?.photos || []);
  const [errors, setErrors] = useState<{ date?: string }>({});

  const handleOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  const save = () => {
    const err: { date?: string } = {};
    if (!date) err.date = t("Requis");
    setErrors(err);
    if (Object.keys(err).length) return;
    onSave({ id: initial?.id, date, rating, species, photos });
  };

  const title = initial ? t("Modifier la cueillette") : t("Ajouter une cueillette");

  if (!open) return null;

  return (
    <div ref={overlayRef} onClick={handleOutside} className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-3">
      <div className="w-full max-w-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className={`text-lg font-semibold ${T_PRIMARY}`}>{title}</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <CoinFormBase
          species={species}
          setSpecies={setSpecies}
          date={date}
          setDate={setDate}
          rating={rating}
          setRating={setRating}
          photos={photos}
          setPhotos={setPhotos}
          dateError={errors.date}
        />

        <div className="flex items-center gap-2 justify-end mt-3">
          {initial && onDelete && (
            <Button
              variant="ghost"
              onClick={onDelete}
              className="text-danger border border-danger hover:bg-danger/10 mr-auto"
            >
              {t("Supprimer")}
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={onClose}
            className={`rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-800 ${T_PRIMARY}`}
          >
            {t("Annuler")}
          </Button>
          <Button className={BTN} onClick={save}>
            {t("Enregistrer")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HarvestModal;
