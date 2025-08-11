import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, LocateFixed, Search, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MUSHROOMS } from "../data/mushrooms";
import { DEMO_ZONES } from "../data/zones";
import { LEGEND } from "../data/legend";
import { classNames } from "../utils";
import { BTN, BTN_GHOST_ICON, T_PRIMARY, T_MUTED } from "../styles/tokens";
import logo from "@/assets/logo.png";
import { loadMap } from "@/services/openstreetmap";
import { useT } from "../i18n";
import type { Zone } from "../types";

export default function MapScene({ onZone, gpsFollow, setGpsFollow, onBack }: { onZone: (z: Zone) => void; gpsFollow: boolean; setGpsFollow: React.Dispatch<React.SetStateAction<boolean>>; onBack: () => void }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<{ marker: any; timeout: ReturnType<typeof setTimeout> }[]>([]);
  const { t } = useT();
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const results = useMemo(
    () =>
      search
        ? DEMO_ZONES.filter(z =>
            z.name.toLowerCase().includes(search.toLowerCase())
          )
        : [],
    [search]
  );
  type Toast = { id: number; text: string };
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (text: string) => {
    const id = Date.now() + Math.random();
    setToasts(curr => {
      const next = [{ id, text }, ...curr];
      return next.slice(0, 3);
    });
    setTimeout(() => {
      setToasts(curr => curr.filter(t => t.id !== id));
    }, 45000);
  };
  const toggleShroom = (id: string) =>
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;
    loadMap().then(maplibregl => {
      const map = new maplibregl.Map({
        container: mapContainer.current as HTMLDivElement,
        style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        center: [2.3522, 48.8566],
        zoom: 5,
      });
      mapRef.current = map;
      // Use logo as cursor on desktop
      const canvas = map.getCanvas();
      canvas.style.cursor = `url(${logo}) 16 16, auto`;

      map.on("click", (e: any) => {
        const { lat, lng } = e.lngLat;

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
          markersRef.current = markersRef.current.filter(m => m.marker !== marker);
        }, 45000);
        markersRef.current.push({ marker, timeout });
        if (markersRef.current.length > 3) {
          const oldest = markersRef.current.shift();
          if (oldest) {
            clearTimeout(oldest.timeout);
            oldest.marker.remove();
          }
        }

        // Find nearest demo zone to the tapped coordinates
        let nearest: Zone | null = null;
        let minDist = Infinity;
        for (const z of DEMO_ZONES) {
          const [zLat, zLng] = z.coords;
          const dist = Math.hypot(lat - zLat, lng - zLng);
          if (dist < minDist) {
            minDist = dist;
            nearest = z;
          }
        }
        if (nearest) {
          const speciesLines = Object.entries(nearest.species)
            .map(([id, sc]) => {
              const name = MUSHROOMS.find(m => m.id === id)?.name.split(" ")[0] || id;
              return `${name} ${sc}%`;
            })
            .join("\n");
          const msg = `${nearest.name}\n${nearest.score}% ${nearest.trend}\n${speciesLines}`;
          showToast(msg);
        }
      });
    });
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

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
            placeholder={t("Rechercher un lieu…")}
            className={`pl-9 bg-secondary border-secondary dark:bg-secondary dark:border-secondary ${T_PRIMARY}`}
          />
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${T_MUTED}`} />
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
          variant={gpsFollow ? "secondary" : "primary"}
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
        <div className="absolute top-3 left-3 bg-secondary/80 dark:bg-secondary/80 backdrop-blur rounded-xl p-2 border border-secondary dark:border-secondary flex items-center gap-2">
          <span className={`text-xs ${T_PRIMARY}`}>{t("Légende")}</span>
          {LEGEND.map((l, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={classNames("w-3 h-3 rounded", l.color)} />
              <span className={`text-[10px] ${T_MUTED}`}>{l.label}</span>
            </div>
          ))}
        </div>
        {toasts.length > 0 && (
          <div className="absolute left-3 top-16 flex flex-col gap-2">
            {toasts.map(toast => (
              <div
                key={toast.id}
                className="bg-secondary/80 dark:bg-secondary/80 backdrop-blur rounded-xl p-2 border border-secondary dark:border-secondary"
              >
                <div className={`text-xs whitespace-pre-line ${T_PRIMARY}`}>{toast.text}</div>
              </div>
            ))}
          </div>
        )}

      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {MUSHROOMS.map(m => (
          <Button
            key={m.id}
            onClick={() => toggleShroom(m.id)}
            className={BTN}
            variant={selected.includes(m.id) ? "secondary" : "primary"}
          >
            {m.name}
          </Button>
        ))}
      </div>
    </motion.section>
  );
}
