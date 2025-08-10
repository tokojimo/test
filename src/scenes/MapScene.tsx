import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, LocateFixed, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MUSHROOMS } from "../data/mushrooms";
import { DEMO_ZONES } from "../data/zones";
import { LEGEND } from "../data/legend";
import { classNames } from "../utils";
import { BTN, BTN_GHOST_ICON, T_PRIMARY, T_MUTED, T_SUBTLE } from "../styles/tokens";
import mapboxgl from "mapbox-gl";
import { useT } from "../i18n";
import { NotificationStack, Notification } from "../components/NotificationStack";

export default function MapScene({ onZone, onOpenShroom, gpsFollow, setGpsFollow, onBack }: { onZone: (z: any) => void; onOpenShroom: (id: string) => void; gpsFollow: boolean; setGpsFollow: React.Dispatch<React.SetStateAction<boolean>>; onBack: () => void }) {
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [zoom, setZoom] = useState(5);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { t } = useT();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (msg: string) =>
    setNotifications(prev => [...prev, { id: Date.now(), message: msg }]);
  const removeNotification = (id: number) =>
    setNotifications(prev => prev.filter(n => n.id !== id));

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;
    mapboxgl.accessToken = "pk.eyJ1IjoiZGVtb3VzZXIiLCJhIjoiY2toZ2QzMjEwMDI5djJybXkxdWRwMmd2eSJ9.dummy";
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [2.3522, 48.8566],
      zoom,
    });
    const handleClick = (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
      addNotification(
        t("Map clicked at {lng}, {lat}", {
          lng: e.lngLat.lng.toFixed(2),
          lat: e.lngLat.lat.toFixed(2),
        })
      );
    };
    map.on("click", handleClick);
    mapRef.current = map;
    map.on("load", () => {
      map.addSource("mock", {
        type: "raster",
        tiles: ["https://example.com/mock/{z}/{x}/{y}.png"],
        tileSize: 256,
      });
      map.addLayer({ id: "mock", type: "raster", source: "mock" });
    });
    return () => {
      map.off("click", handleClick);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setZoom(zoom);
    }
  }, [zoom]);
  const zones = useMemo(() => (selectedSpecies.length === 0 ? DEMO_ZONES : DEMO_ZONES.filter(z => selectedSpecies.every(id => (z.species[id] || 0) > 50))), [selectedSpecies]);

  return (
    <motion.section initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="p-3">
      <NotificationStack notifications={notifications} onRemove={removeNotification} />
      <div className="flex items-center gap-2 mb-3">
        <Button variant="ghost" size="icon" onClick={onBack} className={BTN_GHOST_ICON} aria-label={t("Retour")}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="relative flex-1">
          <Input
            placeholder={t("Rechercher un lieu…")}
            className={`pl-9 bg-neutral-100 border-neutral-300 dark:bg-neutral-900 dark:border-neutral-800 ${T_PRIMARY}`}
          />
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${T_MUTED}`} />
        </div>
        <Button onClick={() => setGpsFollow(v => !v)} className={BTN}>
          <LocateFixed className="w-4 h-4 mr-2" />
          {t("GPS")}
        </Button>
      </div>

      <div className="relative h-[60vh] rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setGpsFollow(true)}
            className={BTN_GHOST_ICON}
            aria-label={t("Ma position")}
          >
            📍
          </Button>
          <div className="bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur rounded-xl p-2 border border-neutral-300 dark:border-neutral-800 flex items-center gap-2">
            <span className={`text-xs ${T_PRIMARY}`}>{t("Légende")}</span>
            {LEGEND.map((l, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className={classNames("w-3 h-3 rounded", l.color)} />
                <span className={`text-[10px] ${T_MUTED}`}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-3 left-3 grid gap-2">
          {zones.map(z => (
            <div
              key={z.id}
              onClick={() => {
                addNotification(t("Zone clicked: {name}", { name: z.name }));
                onZone(z);
              }}
              role="button"
              tabIndex={0}
              className="bg-neutral-100/80 hover:bg-neutral-200/80 dark:bg-neutral-900/80 dark:hover:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-800 rounded-xl px-3 py-2 text-left cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className={`font-medium ${T_PRIMARY}`}>{z.name}</div>
                <Badge variant={z.score > 85 ? "default" : "secondary"}>{z.score}%</Badge>
              </div>
              <div className={`text-xs ${T_MUTED}`}>{t(z.trend)}</div>
              <div className="mt-1 flex gap-1">
                {Object.entries(z.species).map(([id, sc]) => (
                  <span key={id} onClick={(e) => { e.stopPropagation(); onOpenShroom(id); }} className={`text-[10px] bg-neutral-200 border border-neutral-300 hover:bg-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 dark:hover:bg-neutral-700 px-2 py-1 rounded-full ${T_PRIMARY} cursor-pointer`}>{MUSHROOMS.find(m => m.id === id)?.name.split(" ")[0]} {sc}%</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-3 right-3 bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur rounded-xl p-2 border border-neutral-300 dark:border-neutral-800">
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
