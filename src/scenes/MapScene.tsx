import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, LocateFixed, Search, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MUSHROOMS } from "../data/mushrooms";
import { DEMO_ZONES } from "../data/zones";
import { LEGEND } from "../data/legend";
import { classNames } from "../utils";
import { BTN, BTN_GHOST_ICON, T_PRIMARY, T_MUTED } from "../styles/tokens";
import logo from "@/assets/logo.png";
import { loadMap, geocode, reverseGeocode } from "@/services/openstreetmap";
import { useT } from "../i18n";
import type { Zone } from "../types";

function Toast({
  message,
  details,
  onClick,
}: {
  message: string;
  details?: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="bg-secondary/80 dark:bg-secondary/80 backdrop-blur rounded-xl p-2 border border-secondary dark:border-secondary text-left"
    >
      <div className={`text-xs ${T_PRIMARY}`}>
        <div>{message}</div>
        {details && <div className="mt-1 whitespace-pre-line">{details}</div>}
      </div>
    </motion.button>
  );
}

export default function MapScene({ onZone, gpsFollow, setGpsFollow, onBack }: { onZone: (z: Zone) => void; gpsFollow: boolean; setGpsFollow: React.Dispatch<React.SetStateAction<boolean>>; onBack: () => void }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const maplibreRef = useRef<any>(null);
  const markersRef = useRef<{
    id: number;
    marker: any;
    timeout: ReturnType<typeof setTimeout>;
  }[]>([]);
  const { t } = useT();
  const [selected, setSelected] = useState<string[]>(["cepe_de_bordeaux"]);
  const [search, setSearch] = useState("");
  const handleGeocode = async () => {
    if (!search) return;
    const res = await geocode(search);
    const loc = res[0];
    if (loc && mapRef.current) {
      mapRef.current.flyTo({ center: [loc.lon, loc.lat], zoom: 12 });
    }
  };
  const results = useMemo(
    () =>
      search
        ? DEMO_ZONES.filter(z =>
            z.name.toLowerCase().includes(search.toLowerCase())
          )
        : [],
    [search]
  );
  type Toast = { id: number; text: string; details?: string; zone: Zone };
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [markers, setMarkers] = useState<{
    id: number;
    lat: number;
    lng: number;
  }[]>([]);
  const toggleShroom = (id: string) =>
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );

  const handleMapClick = useCallback(
    async (e: any) => {
      if (!maplibreRef.current || !mapRef.current) return;
      const maplibregl = maplibreRef.current;
      const map = mapRef.current;
      const { lat, lng } = e.lngLat;
      const id = Date.now() + Math.random();

      // Drop a temporary logo marker at the clicked location
      const el = document.createElement("img");
      el.src = logo;
      el.className = "w-6 h-6 pointer-events-none animate-bounce";
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map);
      setTimeout(() => el.classList.remove("animate-bounce"), 1000);
      const timeout = setTimeout(() => {
        marker.remove();
        markersRef.current = markersRef.current.filter(m => m.id !== id);
        setMarkers(curr => curr.filter(m => m.id !== id));
      }, 45000);
      markersRef.current.push({ id, marker, timeout });
      setMarkers(curr => [{ id, lat, lng }, ...curr].slice(0, 3));
      if (markersRef.current.length > 3) {
        const oldest = markersRef.current.shift();
        if (oldest) {
          clearTimeout(oldest.timeout);
          oldest.marker.remove();
          setMarkers(curr => curr.filter(m => m.id !== oldest.id));
        }
      }

      // Create a new zone based on the tapped coordinates
      const placeName = await reverseGeocode(lat, lng);
      const demo = DEMO_ZONES[1];
      const zone: Zone = {
        id: `zone-${id}`,
        name: placeName || demo.name,
        score: demo.score,
        species: demo.species,
        trend: demo.trend,
        coords: [lat, lng],
      };

      const lower = zone.name.toLowerCase();
      const waterWords = ["eau", "lac", "rivière", "river", "mer", "océan", "étang", "sea", "water"];
      if (waterWords.some(w => lower.includes(w))) {
        setToasts(curr => [
          { id, text: "Pas de champignons ici 😄", zone },
          ...curr,
        ].slice(0, 3));
      } else {
        const details = `${zone.score}% ${zone.trend}\nCèpe ${zone.species.cepe_de_bordeaux}%\nGirolle ${zone.species.girolle}%\nMorille ${zone.species.morille_commune}%`;
        setToasts(curr => [{ id, text: zone.name, details, zone }, ...curr].slice(0, 3));
      }

      setTimeout(() => {
        setToasts(curr => curr.filter(t => t.id !== id));
      }, 45000);
    },
    []
  );

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;
    loadMap().then(maplibregl => {
      maplibreRef.current = maplibregl;
      const map = new maplibregl.Map({
        container: mapContainer.current as HTMLDivElement,
        style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        center: [2.3522, 48.8566],
        zoom: 5,
      });
      mapRef.current = map;
      const canvas = map.getCanvas();
      canvas.style.cursor = `url(${logo}) 16 16, auto`;

      map.on("click", handleMapClick);
    });
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [handleMapClick]);

  return (
    <motion.section initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="p-3">
      <div className="flex items-center gap-2 mb-3">
        <Button variant="ghost" size="icon" onClick={onBack} className={BTN_GHOST_ICON} aria-label={t("Retour")}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="relative flex-1">
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                handleGeocode();
              }
            }}
            placeholder={t("Rechercher un lieu…")}
            className={`pl-9 ${T_PRIMARY}`}
          />
          <div className="absolute inset-y-0 left-0 flex w-9 items-center justify-center">
            <Search className={`w-4 h-4 ${T_MUTED}`} />
          </div>
          {results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-secondary dark:bg-secondary border border-secondary dark:border-secondary rounded-xl z-10">
              {results.map(z => (
                <button
                  key={z.id}
                  onClick={() => {
                    onZone(z);
                    setSearch("");
                  }}
                  className={`block w-full text-left px-3 py-2 hover:bg-accent/20 ${T_PRIMARY}`}
                >
                  {z.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <Button
          onClick={() => setGpsFollow(v => !v)}
          className={BTN}
          variant={gpsFollow ? "primary" : "secondary"}
        >
          <LocateFixed className="w-4 h-4 mr-2" />
          {t("GPS")}
        </Button>
      </div>

      <div className="relative h-[60vh] rounded-2xl border border-secondary dark:border-secondary bg-secondary dark:bg-secondary overflow-hidden">
        <div
          ref={mapContainer}
          className="absolute inset-0 w-full h-full"
          style={{ cursor: `url(${logo}) 16 16, auto` }}
        />

        {gpsFollow && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setGpsFollow(true)}
            className={`absolute top-3 right-3 ${BTN_GHOST_ICON}`}
            aria-label={t("Centrer sur ma position")}
          >
            <Navigation className="w-4 h-4" />
          </Button>
        )}
        <div className="absolute top-3 left-3 bg-secondary/80 dark:bg-secondary/80 backdrop-blur rounded-xl p-2 border border-secondary dark:border-secondary flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span className={`text-xs ${T_PRIMARY}`}>{t("Légende")}</span>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            {LEGEND.map((l, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className={classNames("w-3 h-3 rounded", l.color)} />
                <span className={`text-[10px] ${T_MUTED}`}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        {toasts.length > 0 && (
          <div className="absolute left-3 top-24 sm:top-16 flex flex-col space-y-2">
            <AnimatePresence initial={false}>
              {toasts.map(toast => (
                <Toast
                  key={toast.id}
                  message={toast.text}
                  details={toast.details}
                  onClick={() => {
                    onZone(toast.zone);
                    setToasts(curr => curr.filter(t => t.id !== toast.id));
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {MUSHROOMS.map(m => (
          <Button
            key={m.id}
            onClick={() => toggleShroom(m.id)}
            className={BTN}
            variant={selected.includes(m.id) ? "primary" : "secondary"}
          >
            {m.name}
          </Button>
        ))}
      </div>
    </motion.section>
  );
}
