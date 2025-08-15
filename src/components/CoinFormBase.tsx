import React, { useEffect, useRef } from "react";
import { X, Image } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MUSHROOMS } from "@/data/mushrooms";
import { BTN, T_PRIMARY, T_MUTED, T_SUBTLE } from "@/styles/tokens";
import { StarRating } from "./StarRating";
import { useT } from "@/i18n";

interface CoinFormBaseProps {
  species: string[];
  setSpecies: (s: string[]) => void;
  date: string;
  setDate: (v: string) => void;
  rating: number;
  setRating: (v: number) => void;
  photos: string[];
  setPhotos: (p: string[]) => void;
  dateError?: string;
}

export function CoinFormBase({
  species,
  setSpecies,
  date,
  setDate,
  rating,
  setRating,
  photos,
  setPhotos,
  dateError,
}: CoinFormBaseProps) {
  const { t } = useT();
  const photoUrlsRef = useRef<string[]>([]);

  const importImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const urls = files.map((f) => URL.createObjectURL(f));
    photoUrlsRef.current.push(...urls);
    setPhotos((p) => [...p, ...urls]);
  };

  useEffect(() => {
    const current = new Set(photos);
    photoUrlsRef.current = photoUrlsRef.current.filter((url) => {
      if (!current.has(url)) {
        URL.revokeObjectURL(url);
        return false;
      }
      return true;
    });
  }, [photos]);

  useEffect(() => {
    return () => {
      photoUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <div className="space-y-3">
      <div>
        <div className={`text-sm mb-1 ${T_PRIMARY}`}>{t("Champignons trouvés")}</div>
        <div className="flex flex-wrap gap-2 mb-2">
          {species.map((id) => (
            <span
              key={id}
              className="inline-flex items-center gap-1 bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-full px-2 py-1 text-xs"
            >
              <span className={T_PRIMARY}>{MUSHROOMS.find((m) => m.id === id)?.name.split(" ")[0]}</span>
              <button
                onClick={() => setSpecies(species.filter((x) => x !== id))}
                className="text-neutral-400 hover:text-neutral-200"
                aria-label={t("supprimer")}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <Select
          onChange={(e) => {
            const v = e.target.value;
            if (v) setSpecies(species.includes(v) ? species : [...species, v]);
          }}
          value=""
          className="rounded-xl"
        >
          <option value="" disabled>
            {t("Ajouter un champignon…")}
          </option>
          {MUSHROOMS.filter((m) => !species.includes(m.id)).map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <div className={`text-sm ${T_PRIMARY}`}>{t("Dernière cueillette")}</div>
        <div className="mt-1">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-neutral-100 border border-neutral-300 text-neutral-900 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-100 rounded-xl px-3 py-2 text-sm"
          />
          {dateError && <p className="text-xs text-danger mt-1">{dateError}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={`text-sm ${T_MUTED}`}>{t("Note")}</span>
        <StarRating value={rating} onSelectIndex={(i) => setRating(5 - i)} />
        <span className={`text-xs ${T_SUBTLE}`}>{rating}/5</span>
      </div>

      <div className="pt-2 border-t border-neutral-300 dark:border-neutral-800">
        <div className="flex items-center justify-between mb-2">
          <div className={`text-sm ${T_PRIMARY}`}>{t("Photos")}</div>
          <label className="inline-flex items-center">
            <input type="file" accept="image/*" multiple className="hidden" onChange={importImages} />
            <Button type="button" className={BTN}>
              <Image className="w-4 h-4 mr-2" />
              {t("Importer des photos")}
            </Button>
          </label>
        </div>
        {photos.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {photos.map((p, i) => (
              <img
                key={i}
                src={p}
                className="w-full h-20 object-cover rounded-lg border border-neutral-300 dark:border-neutral-800"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CoinFormBase;
