import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BTN, T_PRIMARY } from "../styles/tokens";
import { useT } from "../i18n";
import { CoinFormBase, CoinFormValues } from "./CoinFormBase";
import type { VisitHistory } from "../types";
import { todayISO } from "../utils";

interface Props {
  visit?: VisitHistory;
  onClose: () => void;
  onSave: (v: VisitHistory) => void;
  onDelete?: () => void;
}

export function HarvestModal({ visit, onClose, onSave, onDelete }: Props) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const { t } = useT();
  const [values, setValues] = useState<CoinFormValues>({
    species: visit?.species || [],
    date: visit?.date || todayISO(),
    rating: visit?.rating || 0,
    photos: visit?.photos || [],
  });

  const handleOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  const save = () => {
    onSave({
      id: visit?.id || crypto.randomUUID(),
      date: values.date,
      rating: values.rating,
      note: visit?.note || "",
      photos: values.photos,
      species: values.species,
    });
    onClose();
  };

  return (
    <div ref={overlayRef} onClick={handleOutside} className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-3">
      <div className="w-full max-w-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`text-lg font-semibold ${T_PRIMARY}`}>
            {visit ? t("Modifier la cueillette") : t("Ajouter une cueillette")}
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <CoinFormBase values={values} onChange={setValues} />
        <div className="mt-4 flex items-center justify-between">
          {visit && onDelete && (
            <Button variant="destructive" onClick={onDelete} className={BTN}>
              {t("Supprimer")}
            </Button>
          )}
          <div className="ml-auto flex items-center gap-2">
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
    </div>
  );
}

export default HarvestModal;
