import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, LocateFixed, Search, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MUSHROOMS } from "../data/mushrooms";
import { DEMO_ZONES } from "../data/zones";
import { LEGEND } from "../data/legend";
import { classNames } from "../utils";
import { BTN, BTN_GHOST_ICON, T_PRIMARY, T_MUTED, T_SUBTLE, PAGE } from "../styles/tokens";
import { loadMapKit } from "@/services/mapkit";
import { useT } from "../i18n";
import type { Zone } from "../types";

export default function MapScene({ onZone, onOpenShroom, gpsFollow, setGpsFollow, onMapClick, onBack }: { onZone: (z: Zone) => void; onOpenShroom: (id: string) => void; gpsFollow: boolean; setGpsFollow: React.Dispatch<React.SetStateAction<boolean>>; onMapClick?: (msg: string) => void; onBack: () => void }) {
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [zoom, setZoom] = useState(5);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const { t } = useT();

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;
    loadMapKit().then(() => {
      const map = new mapkit.Map(mapContainer.current);
      map.tintColor = "#C6A15B";
      map.showsMapTypeControl = false;
      map.showsCompass = false;
      map.region = new mapkit.CoordinateRegion(
        new mapkit.Coordinate(48.8566, 2.3522),
        new mapkit.CoordinateSpan(0.5, 0.5)
      );
      mapRef.current = map;
      map.addEventListener("singleTap", (e: any) => {
        const { latitude: lat, longitude: lng } = e.coordinate;
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
          onMapClick?.(msg);
        }
      });
    });
    return () => {
      mapRef.current?.destroy();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      (mapRef.current as any).zoom = zoom;
    }
  }, [zoom]);
  const zones = useMemo<Zone[]>(() => (selectedSpecies.length === 0 ? DEMO_ZONES : DEMO_ZONES.filter(z => selectedSpecies.every(id => (z.species[id] || 0) > 50))), [selectedSpecies]);

  return (
    <motion.section initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className={`p-3 ${PAGE}`}>
      <div className="flex items-center gap-2 mb-3">
        <Button variant="ghost" size="icon" onClick={onBack} className={BTN_GHOST_ICON} aria-label={t("Retour")}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="relative flex-1">
          <Input
            placeholder={t("Rechercher un lieu…")}
            className={`pl-9 bg-secondary border-secondary dark:bg-secondary dark:border-secondary ${T_PRIMARY}`}
          />
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${T_MUTED}`} />
        </div>
        <Button onClick={() => setGpsFollow(v => !v)} className={BTN}>
          <LocateFixed className="w-4 h-4 mr-2" />
          {t("GPS")}
        </Button>
      </div>

      <div className="relative h-[60vh] rounded-2xl border border-secondary dark:border-secondary bg-secondary dark:bg-secondary overflow-hidden">
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

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

        <div className="absolute bottom-3 left-3 grid gap-2">
          {zones.map(z => (
            <div
              key={z.id}
              onClick={() => onZone(z)}
              role="button"
              tabIndex={0}
              className="bg-secondary/80 hover:bg-secondary/80 dark:bg-secondary/80 dark:hover:bg-secondary/80 border border-secondary dark:border-secondary rounded-xl px-3 py-2 text-left cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className={`font-medium ${T_PRIMARY}`}>{z.name}</div>
                <Badge variant={z.score > 85 ? "default" : "secondary"}>{z.score}%</Badge>
              </div>
              <div className={`text-xs ${T_MUTED}`}>{t(z.trend)}</div>
              <div className="mt-1 flex gap-1">
                {Object.entries(z.species).map(([id, sc]) => (
                  <span key={id} onClick={(e) => { e.stopPropagation(); onOpenShroom(id); }} className={`text-[10px] bg-secondary border border-secondary hover:bg-secondary dark:bg-secondary dark:border-secondary dark:hover:bg-secondary px-2 py-1 rounded-full ${T_PRIMARY} cursor-pointer`}>{MUSHROOMS.find(m => m.id === id)?.name.split(" ")[0]} {sc}%</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-3 right-3 bg-secondary/80 dark:bg-secondary/80 backdrop-blur rounded-xl p-2 border border-secondary dark:border-secondary">
          <input type="range" min={1} max={14} value={zoom} onChange={(e) => setZoom(parseInt(e.target.value, 10))} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {MUSHROOMS.map(m => {
          const active = selectedSpecies.includes(m.id);
          return (
            <Button key={m.id} onClick={() => setSelectedSpecies(s => active ? s.filter(x => x !== m.id) : [...s, m.id])} className={classNames(BTN, active ? "" : "opacity-60")}>{m.name}</Button>
          );
        })}
      </div>

      <p className={`text-xs mt-2 ${T_SUBTLE}`}>
        {t("Hors ligne : affichage des zones optimales Cèpe, Girolle, Morille.")}
      </p>
    </motion.section>
  );
}
