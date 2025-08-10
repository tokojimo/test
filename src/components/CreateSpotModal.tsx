import React, { useState, useRef } from "react";
import { X, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MUSHROOMS } from "../data/mushrooms";
import { BTN, T_PRIMARY, T_MUTED, T_SUBTLE } from "../styles/tokens";
import { StarRating } from "./StarRating";
import { useT } from "../i18n";
import type { Spot } from "../types";

export function CreateSpotModal({ onClose, onCreate }: { onClose: () => void; onCreate: (spot: Spot) => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const { t } = useT();
  const [name, setName] = useState(t("Mon nouveau coin"));
  const [species, setSpecies] = useState<string[]>(["cepe"]);
  const [rating, setRating] = useState(4);
  const [last, setLast] = useState(today);
  const [location, setLocation] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  const importImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const urls = files.map((f) => URL.createObjectURL(f));
    setPhotos((p) => [...p, ...urls]);
  };

  const handleOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  const create = () => {
    const cover = photos[0] || MUSHROOMS[0].photo;
    const history = [{ date: last, rating, note: t("Création"), photos: photos.slice(0, 3) }];
    onCreate({ id: Date.now(), name, species, rating, last, location, cover, photos: photos.length ? photos : [cover], history });
  };

  return (
    <div ref={overlayRef} onClick={handleOutside} className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-3">
      <div className="w-full max-w-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`text-lg font-semibold ${T_PRIMARY}`}>{t("Nouveau coin")}</div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-100"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("Nom du coin")}
            className={`bg-neutral-100 border-neutral-300 dark:bg-neutral-900 dark:border-neutral-800 ${T_PRIMARY}`}
          />
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t("Localisation (coordonnées ou lieu)")}
            className={`bg-neutral-100 border-neutral-300 dark:bg-neutral-900 dark:border-neutral-800 ${T_PRIMARY}`}
          />

          <div>
            <div className={`text-sm mb-1 ${T_PRIMARY}`}>{t("Champignons trouvés")}</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {species.map((id) => (
                <span key={id} className="inline-flex items-center gap-1 bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-full px-2 py-1 text-xs">
                  <span className={T_PRIMARY}>{MUSHROOMS.find((m) => m.id === id)?.name.split(" ")[0]}</span>
                  <button
                    onClick={() => setSpecies((list) => list.filter((x) => x !== id))}
                    className="text-neutral-400 hover:text-neutral-200"
                    aria-label={t("supprimer")}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <select onChange={(e) => { const v = e.target.value; if (v) setSpecies((list) => list.includes(v) ? list : [...list, v]); }} value="" className="bg-neutral-100 border border-neutral-300 text-neutral-900 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-100 rounded-xl px-3 py-2 text-sm">
              <option value="" disabled>
                {t("Ajouter un champignon…")}
              </option>
              {MUSHROOMS.filter((m) => !species.includes(m.id)).map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <div className={`text-sm ${T_PRIMARY}`}>{t("Dernière visite")}</div>
            <div className="mt-1">
              <input type="date" value={last} onChange={(e) => setLast(e.target.value)} className="w-full bg-neutral-100 border border-neutral-300 text-neutral-900 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-100 rounded-xl px-3 py-2 text-sm" />
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
                  <img key={i} src={p} className="w-full h-20 object-cover rounded-lg border border-neutral-300 dark:border-neutral-800" />
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 justify-end">
            <Button variant="ghost" onClick={onClose} className={`rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-800 ${T_PRIMARY}`}>
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
