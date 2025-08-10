import React, { useRef, useState } from "react";
import { X, MapPin, Plus, Pencil, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BTN, BTN_GHOST_ICON, T_PRIMARY, T_MUTED, T_SUBTLE } from "../styles/tokens";

export function SpotDetailsModal({ spot, onClose }: { spot: any; onClose: () => void }) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const photos = spot.photos || [];
  const [history, setHistory] = useState(
    spot.history || (spot.visits || []).map((d: string) => ({ date: d, rating: spot.rating, note: "", photos: [] }))
  );

  const handleOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };
  const addVisit = () => {
    const today = new Date().toISOString().slice(0, 10);
    setHistory((h) => [...h, { date: today, rating: 0, note: "", photos: [] }]);
  };

  return (
    <div ref={overlayRef} onClick={handleOutside} className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-3">
      <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className={`text-lg font-semibold ${T_PRIMARY}`}>Historique du coin</div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-100"><X className="w-5 h-5" /></button>
        </div>

        <div className="relative h-48 rounded-xl overflow-hidden border border-neutral-800 bg-[conic-gradient(at_30%_30%,#14532d,#052e16,#14532d)]">
          <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-xs bg-neutral-900/70 border border-neutral-800 ${T_PRIMARY}`}><MapPin className="w-3 h-3 inline mr-1" />Carte du coin</div>
        </div>
        <p className={`text-xs mt-2 ${T_SUBTLE}`}>La carte affiche l'historique complet avec détails.</p>

        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <div className={`text-sm ${T_PRIMARY}`}>Visites</div>
            <Button onClick={addVisit} className={BTN}><Plus className="w-4 h-4 mr-2" />Ajouter une cueillette</Button>
          </div>
          <div className="space-y-2">
            {history.length === 0 && <div className={T_MUTED}>Aucune visite enregistrée.</div>}
            {history.map((h, i) => (
              <div key={i} className="flex items-start justify-between bg-neutral-900 border border-neutral-800 rounded-xl p-2">
                <div>
                  <div className={`text-sm ${T_PRIMARY}`}>{h.date}</div>
                  <div className={`text-xs ${T_MUTED}`}>Note: {h.rating ?? "–"}/5 {h.note ? `• ${h.note}` : ""}</div>
                </div>
                <div className="flex items-center gap-2">
                  {h.photos && h.photos.length > 0 && (
                    <div className="flex -space-x-2">
                      {h.photos.slice(0, 3).map((p: string, idx: number) => (
                        <img key={idx} src={p} className="w-10 h-10 rounded-lg border border-neutral-800 object-cover" />
                      ))}
                    </div>
                  )}
                  <Button variant="ghost" size="icon" className={BTN_GHOST_ICON} aria-label="modifier"><Pencil className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <div className={`text-sm mb-2 ${T_PRIMARY}`}>Galerie</div>
          {photos.length === 0 ? (
            <div className={T_MUTED}>Aucune photo.</div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {photos.slice(0, 5).map((p: string, i: number) => (
                <button key={i} onClick={() => setLightbox({ open: true, index: i })} className="relative group">
                  <img src={p} className="w-full h-28 object-cover rounded-xl border border-neutral-800" />
                  <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/20 transition" />
                  <Maximize2 className="absolute right-2 bottom-2 w-4 h-4 text-white opacity-0 group-hover:opacity-100" />
                </button>
              ))}
              {photos.length > 5 && (
                <button onClick={() => setLightbox({ open: true, index: 5 })} className="relative grid place-items-center rounded-xl border border-neutral-800 bg-neutral-900/60">
                  <span className={`text-sm ${T_PRIMARY}`}>+{photos.length - 5} photos</span>
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
