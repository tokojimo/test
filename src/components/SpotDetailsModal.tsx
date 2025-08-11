import React, { useRef, useState, useEffect } from "react";
import { X, Plus, Pencil, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BTN, BTN_GHOST_ICON, T_PRIMARY, T_MUTED, T_SUBTLE } from "../styles/tokens";
import { useT } from "../i18n";
import type { Spot, VisitHistory } from "../types";
import { todayISO } from "../utils";
import { loadMapKit } from "@/services/mapkit";
import Logo from "/Logo.png";

export function SpotDetailsModal({ spot, onClose }: { spot: Spot; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });
  const photos = spot.photos || [];
  const [history, setHistory] = useState<VisitHistory[]>(
    spot.history || (spot.visits || []).map((d: string) => ({ date: d, rating: spot.rating, note: "", photos: [] }))
  );
  const { t } = useT();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!spot.location || mapRef.current || !mapContainerRef.current) return;
    const [lng, lat] = spot.location.split(",").map((v) => parseFloat(v.trim()));
    if (Number.isNaN(lng) || Number.isNaN(lat)) return;
    loadMapKit().then(() => {
      const map = new mapkit.Map(mapContainerRef.current);
      map.region = new mapkit.CoordinateRegion(
        new mapkit.Coordinate(lat, lng),
        new mapkit.CoordinateSpan(0.1, 0.1)
      );
      mapRef.current = map;
      const marker = new mapkit.MarkerAnnotation(new mapkit.Coordinate(lat, lng));
      map.addAnnotation(marker);
    });
    return () => {
      mapRef.current?.destroy();
      mapRef.current = null;
    };
  }, [spot.location]);

  const handleOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };
  const addVisit = () => {
    const today = todayISO();
    setHistory((h) => [...h, { date: today, rating: 0, note: "", photos: [] }]);
  };

  return (
    <div ref={overlayRef} onClick={handleOutside} className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-3">
      <div className="w-full max-w-3xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className={`text-lg font-semibold ${T_PRIMARY}`}>{t("Historique du coin")}</div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-100"><X className="w-5 h-5" /></button>
        </div>

        <div className="relative h-48 rounded-xl overflow-hidden border border-neutral-400 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-800">
          <div ref={mapContainerRef} className="absolute inset-0" />
          <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-xs bg-neutral-100/70 dark:bg-neutral-900/70 border border-neutral-400 dark:border-neutral-700 ${T_PRIMARY}`}>
            <img src={Logo} className="w-3 h-3 inline mr-1" alt="" />
            {t("Carte du coin")}
          </div>
        </div>
        <p className={`text-xs mt-2 ${T_SUBTLE}`}>{t("La carte affiche l'historique complet avec détails.")}</p>

        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <div className={`text-sm ${T_PRIMARY}`}>{t("Visites")}</div>
            <Button onClick={addVisit} className={BTN}>
              <Plus className="w-4 h-4 mr-2" />
              {t("Ajouter une cueillette")}
            </Button>
          </div>
          <div className="space-y-2">
            {history.length === 0 && <div className={T_MUTED}>{t("Aucune visite enregistrée.")}</div>}
            {history.map((h, i) => (
              <div key={i} className="flex items-start justify-between bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl p-2">
                <div>
                  <div className={`text-sm ${T_PRIMARY}`}>{h.date}</div>
                  <div className={`text-xs ${T_MUTED}`}>
                    {t("Note:")} {h.rating ?? "–"}/5 {h.note ? `• ${h.note}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {h.photos && h.photos.length > 0 && (
                    <div className="flex -space-x-2">
                      {h.photos.slice(0, 3).map((p: string, idx: number) => (
                        <img key={idx} src={p} className="w-10 h-10 rounded-lg border border-neutral-300 dark:border-neutral-800 object-cover" />
                      ))}
                    </div>
                  )}
                  <Button variant="ghost" size="icon" className={BTN_GHOST_ICON} aria-label={t("modifier")}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <div className={`text-sm mb-2 ${T_PRIMARY}`}>{t("Galerie")}</div>
          {photos.length === 0 ? (
            <div className={T_MUTED}>{t("Aucune photo.")}</div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {photos.slice(0, 5).map((p: string, i: number) => (
                <button key={i} onClick={() => setLightbox({ open: true, index: i })} className="relative group">
                  <img src={p} className="w-full h-28 object-cover rounded-xl border border-neutral-300 dark:border-neutral-800" />
                  <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/20 transition" />
                  <Maximize2 className="absolute right-2 bottom-2 w-4 h-4 text-white opacity-0 group-hover:opacity-100" />
                </button>
              ))}
              {photos.length > 5 && (
                <button onClick={() => setLightbox({ open: true, index: 5 })} className="relative grid place-items-center rounded-xl border border-neutral-300 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60">
                  <span className={`text-sm ${T_PRIMARY}`}>+{photos.length - 5} {t("photos")}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {lightbox.open && (
        <div onClick={() => setLightbox({ open: false, index: 0 })} className="fixed inset-0 z-50 bg-black/90 grid place-items-center p-3">
          <div className="relative w-full max-w-4xl">
            <img src={photos[lightbox.index]} className="w-full max-h-[80vh] object-contain rounded-xl" />
            <div className="absolute inset-0 flex items-center justify-between px-2">
              <button onClick={(e) => { e.stopPropagation(); setLightbox((s) => ({ ...s, index: Math.max(0, s.index - 1) })); }} className="p-2 text-neutral-300">◀</button>
              <button onClick={(e) => { e.stopPropagation(); setLightbox((s) => ({ ...s, index: Math.min(photos.length - 1, s.index + 1) })); }} className="p-2 text-neutral-300">▶</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
