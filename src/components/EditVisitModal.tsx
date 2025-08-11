import React, { useState, useRef, useEffect } from "react";
import { X, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BTN, T_PRIMARY, T_MUTED, T_SUBTLE } from "../styles/tokens";
import { StarRating } from "./StarRating";
import { useT } from "../i18n";
import type { VisitHistory } from "../types";

type Props = {
  visit: VisitHistory;
  onClose: () => void;
  onSave: (v: VisitHistory) => void;
  onDelete: () => void;
};

export function EditVisitModal({ visit, onClose, onSave, onDelete }: Props) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [date, setDate] = useState(visit.date);
  const [rating, setRating] = useState(visit.rating || 0);
  const [note, setNote] = useState(visit.note || "");
  const [photos, setPhotos] = useState<string[]>(visit.photos || []);
  const photoUrlsRef = useRef<string[]>([]);
  const { t } = useT();

  const handleOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

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
    <div ref={overlayRef} onClick={handleOutside} className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-3">
      <div className="w-full max-w-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`text-lg font-semibold ${T_PRIMARY}`}>{t("Modifier la cueillette")}</div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-100"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-3">
          <div>
            <div className={`text-sm mb-1 ${T_PRIMARY}`}>{t("Date")}</div>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-neutral-100 border border-neutral-300 text-neutral-900 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-100 rounded-xl px-3 py-2 text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${T_MUTED}`}>{t("Note")}</span>
            <StarRating value={rating} onSelectIndex={(i) => setRating(5 - i)} />
            <span className={`text-xs ${T_SUBTLE}`}>{rating}/5</span>
          </div>
          <div>
            <div className={`text-sm mb-1 ${T_PRIMARY}`}>{t("Commentaire")}</div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full bg-neutral-100 border border-neutral-300 text-neutral-900 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-100 rounded-xl px-3 py-2 text-sm"
            />
          </div>
          <div>
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
              <div className="grid grid-cols-3 gap-2">
                {photos.map((p, i) => (
                  <div key={i} className="relative">
                    <img src={p} className="w-full h-20 object-cover rounded-lg border border-neutral-300 dark:border-neutral-800" />
                    <button
                      onClick={() => setPhotos((list) => list.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 text-neutral-300 hover:text-neutral-100"
                      aria-label={t("supprimer")}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm(t("Supprimer cette cueillette ?"))) onDelete();
            }}
            className={BTN}
          >
            {t("Supprimer")}
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className={`rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-800 ${T_PRIMARY}`}
            >
              {t("Annuler")}
            </Button>
            <Button
              className={BTN}
              onClick={() => onSave({ date, rating, note, photos })}
            >
              {t("Enregistrer")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

