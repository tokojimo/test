import React, { useRef, useState, useEffect, useMemo } from "react";
import { ChevronLeft, Plus, Pencil, Maximize2, Trash2 } from "lucide-react";
import { animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BTN, BTN_GHOST_ICON, T_PRIMARY, T_MUTED, T_SUBTLE } from "../styles/tokens";
import { useT } from "../i18n";
import type { Spot, VisitHistory } from "../types";
import { todayISO, generateForecast } from "../utils";
import { loadMap } from "@/services/openstreetmap";
import type { StyleSpecification } from "maplibre-gl";
import Logo from "@/assets/logo.png";
import { useAppContext } from "../context/AppContext";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { EditVisitModal } from "../components/EditVisitModal";

export default function SpotDetailsScene({ spot, onBack }: { spot: Spot | null; onBack: () => void }) {
  const { t } = useT();
  const { state, dispatch } = useAppContext();
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 });
  const [history, setHistory] = useState<VisitHistory[]>(
    spot?.history
      ? spot.history.map((h) => ({ id: h.id || crypto.randomUUID(), ...h }))
      : (spot?.visits || []).map((d: string) => ({
          id: crypto.randomUUID(),
          date: d,
          rating: spot?.rating,
          note: "",
          photos: [],
        }))
  );
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const data = useMemo(() => generateForecast(state.prefs.lang), [state.prefs.lang]);

  useEffect(() => {
    if (!spot?.location || mapRef.current || !mapContainerRef.current) return;
    const [lat, lng] = spot.location.split(",").map((v) => parseFloat(v.trim()));
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;
    loadMap().then(maplibregl => {
      const osmStyle: StyleSpecification = {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm",
            type: "raster",
            source: "osm",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      };
      const map = new maplibregl.Map({
        container: mapContainerRef.current as HTMLDivElement,
        style: osmStyle,
        center: [lng, lat],
        zoom: 11,
      });
      mapRef.current = map;
      new maplibregl.Marker().setLngLat([lng, lat]).addTo(map);
    });
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [spot?.location]);

  useEffect(() => {
    const path = chartRef.current?.querySelector(
      ".recharts-line-curve"
    ) as SVGPathElement | null;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    animate(path, { strokeDashoffset: 0 }, { duration: 1.2, ease: "easeInOut" });
  }, [data]);

  if (!spot) return null;
  const photos = spot.photos || [];

  const addVisit = () => {
    const today = todayISO();
    setHistory((h) => {
      const newHistory = [...h, { id: crypto.randomUUID(), date: today, rating: 0, note: "", photos: [] }];
      dispatch({ type: "updateSpot", spot: { ...spot, history: newHistory } });
      return newHistory;
    });
  };

  const handleDelete = () => {
    setConfirmOpen(true);
  };

  return (
    <section className="p-3">
      <div className="w-full max-w-3xl mx-auto bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-2xl p-4">
        <div className="relative h-10 mb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className={`absolute left-0 ${BTN_GHOST_ICON}`}
            aria-label={t("Retour")}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className={`absolute inset-0 grid place-items-center text-lg font-semibold pointer-events-none ${T_PRIMARY}`}>
            {t("Historique du coin")}
          </h2>
          <div className="absolute right-0 flex items-center gap-2">
            <Button variant="ghost" size="icon" className={BTN_GHOST_ICON} onClick={handleDelete} aria-label={t("supprimer")}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
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
          <div className="h-56" ref={chartRef}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: "hsl(var(--forest-green))" }}
                  interval={3}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "hsl(var(--forest-green))" }}
                  width={28}
                />
                <Tooltip
                  contentStyle={{
                    background: "#171717",
                    border: "1px solid #262626",
                    borderRadius: 12,
                    color: "#e5e5e5",
                  }}
                />
                <ReferenceLine x={data[7].day} stroke="#525252" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--fern-green))"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className={`mt-2 text-xs ${T_SUBTLE}`}>Prévisions locales (démo)</div>
        </div>

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
              <div key={h.id} className="flex items-start justify-between bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl p-2">
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className={BTN_GHOST_ICON}
                    aria-label={t("modifier")}
                    onClick={() => setEditIndex(i)}
                  >
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
                  <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/20 transition" style={{ willChange: "opacity" }} />
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
      {editIndex !== null && (
        <EditVisitModal
          visit={history[editIndex]}
          onClose={() => setEditIndex(null)}
          onSave={(v) => {
            const newHistory = history.map((h, idx) => (idx === editIndex ? v : h));
            setHistory(newHistory);
            dispatch({ type: "updateSpot", spot: { ...spot, history: newHistory } });
            setEditIndex(null);
          }}
          onDelete={() => {
            const newHistory = history.filter((_, idx) => idx !== editIndex);
            setHistory(newHistory);
            dispatch({ type: "updateSpot", spot: { ...spot, history: newHistory } });
            setEditIndex(null);
          }}
        />
      )}
      <ConfirmDeleteModal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          dispatch({ type: "removeSpot", id: spot.id });
          setConfirmOpen(false);
          onBack();
        }}
      />
    </section>
  );
}

