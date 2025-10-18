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
import { RASTER_LAYERS, effectiveBounds } from "@/config/rasterLayers";
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
  const watchIdRef = useRef<number | null>(null);
  const positionMarkerRef = useRef<any>(null);
  const positionMarkerDirectionRef = useRef<HTMLDivElement | null>(null);
  const lastKnownPositionRef = useRef<{ lat: number; lng: number } | null>(null);
  const userPositionRef = useRef<{
    lat: number;
    lng: number;
    accuracy?: number;
  } | null>(null);
  const { t } = useT();
  const [selected, setSelected] = useState<string[]>(["cepe_de_bordeaux"]);
  const [search, setSearch] = useState("");
  const [mapReady, setMapReady] = useState(false);
  const [userPosition, setUserPosition] = useState<{
    lat: number;
    lng: number;
    accuracy?: number;
  } | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
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
  type Toast = { id: number; text: string; details?: string; zone?: Zone };
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [markers, setMarkers] = useState<{
    id: number;
    lat: number;
    lng: number;
  }[]>([]);
  const notifyGpsError = useCallback(
    (message: string, details?: string) => {
      const id = Date.now() + Math.random();
      setToasts(curr => [{ id, text: message, details }, ...curr].slice(0, 3));
      setTimeout(() => {
        setToasts(curr => curr.filter(t => t.id !== id));
      }, 8000);
    },
    [setToasts]
  );
  const toggleShroom = (id: string) =>
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );

  const applyRasterVisibility = useCallback((map: any, selection: string[]) => {
    RASTER_LAYERS.forEach(layer => {
      const layerId = `raster-layer-${layer.id}`;
      if (!map.getLayer || !map.getLayer(layerId)) return;
      const matchesSelection =
        layer.species.length === 0 ||
        layer.species.some(speciesId => selection.includes(speciesId));
      const shouldShow = layer.isVisible && matchesSelection;
      const visibility = shouldShow ? "visible" : "none";
      if (map.getLayoutProperty(layerId, "visibility") !== visibility) {
        map.setLayoutProperty(layerId, "visibility", visibility);
      }
      const currentOpacity = map.getPaintProperty(layerId, "raster-opacity");
      if (currentOpacity !== layer.opacity) {
        map.setPaintProperty(layerId, "raster-opacity", layer.opacity);
      }
    });
  }, []);

  const clearGpsWatcher = useCallback(() => {
    if (
      watchIdRef.current !== null &&
      typeof navigator !== "undefined" &&
      navigator.geolocation
    ) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    watchIdRef.current = null;
  }, []);

  const removePositionMarker = useCallback(() => {
    if (positionMarkerRef.current) {
      positionMarkerRef.current.remove();
      positionMarkerRef.current = null;
    }
    positionMarkerDirectionRef.current = null;
  }, []);

  const updateMarkerHeading = useCallback((angle: number | null) => {
    if (!positionMarkerDirectionRef.current) return;
    const rotation = angle ?? 0;
    positionMarkerDirectionRef.current.style.transform =
      `translate(-50%, calc(-100% - 2px)) rotate(${rotation}deg)`;
  }, []);

  const stopGpsTracking = useCallback(
    (clearPosition = true) => {
      clearGpsWatcher();
      removePositionMarker();
      if (clearPosition) {
        setUserPosition(null);
        userPositionRef.current = null;
        lastKnownPositionRef.current = null;
      }
    },
    [clearGpsWatcher, removePositionMarker, setUserPosition]
  );

  const recenterOnPosition = useCallback(
    (position?: { lat: number; lng: number }) => {
      const target = position ?? lastKnownPositionRef.current ?? userPositionRef.current;
      if (target && mapRef.current) {
        mapRef.current.flyTo({ center: [target.lng, target.lat], zoom: 15 });
      }
    },
    []
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

      const waterWords = ["eau", "lac", "rivière", "river", "mer", "océan", "étang", "sea", "water"];
      const lower = (placeName || "").toLowerCase();
      if (!placeName || waterWords.some(w => lower.includes(w))) {
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
    if (!gpsFollow) {
      stopGpsTracking();
      return;
    }

    if (
      typeof window === "undefined" ||
      typeof navigator === "undefined" ||
      !navigator.geolocation
    ) {
      stopGpsTracking();
      notifyGpsError(
        "Localisation indisponible",
        "La géolocalisation n'est pas supportée par ce navigateur."
      );
      setGpsFollow(false);
      return;
    }

    const success = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      const coords = {
        lat: latitude,
        lng: longitude,
        accuracy: typeof accuracy === "number" ? accuracy : undefined,
      };
      userPositionRef.current = coords;
      lastKnownPositionRef.current = { lat: latitude, lng: longitude };
      setUserPosition(coords);
      recenterOnPosition(coords);
    };

    const error = (err: GeolocationPositionError) => {
      stopGpsTracking();
      setGpsFollow(false);
      let message = "Localisation impossible";
      if (err.code === err.PERMISSION_DENIED) {
        message = "Permission de localisation refusée";
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        message = "Position indisponible";
      } else if (err.code === err.TIMEOUT) {
        message = "Localisation expirée";
      }
      notifyGpsError(message, err.message);
    };

    try {
      const watchId = navigator.geolocation.watchPosition(success, error, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 20000,
      });
      watchIdRef.current = watchId;
    } catch (err) {
      stopGpsTracking();
      setGpsFollow(false);
      const details =
        err instanceof Error
          ? `${err.name ? `${err.name}: ` : ""}${err.message}`
          : undefined;
      notifyGpsError(
        "Localisation indisponible",
        `La géolocalisation n'est pas disponible dans ce contexte.${
          details ? `\n${details}` : ""
        }`
      );
      return;
    }

    return () => {
      clearGpsWatcher();
    };
  }, [
    clearGpsWatcher,
    gpsFollow,
    notifyGpsError,
    recenterOnPosition,
    setGpsFollow,
    stopGpsTracking,
  ]);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    applyRasterVisibility(mapRef.current, selected);
  }, [applyRasterVisibility, mapReady, selected]);

  useEffect(() => {
    if (!gpsFollow) {
      setHeading(null);
      return;
    }

    if (typeof window === "undefined") return;
    if (!("DeviceOrientationEvent" in window)) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (typeof event.alpha === "number") {
        setHeading(event.alpha);
      } else {
        setHeading(null);
      }
    };

    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [gpsFollow]);

  useEffect(() => {
    if (!mapRef.current || !maplibreRef.current) return;

    if (!userPosition) {
      removePositionMarker();
      return;
    }

    if (!positionMarkerRef.current) {
      const container = document.createElement("div");
      container.className =
        "relative flex items-center justify-center pointer-events-none";

      const direction = document.createElement("div");
      direction.className =
        "absolute left-1/2 top-0 h-0 w-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[12px] border-b-blue-500 drop-shadow-md transition-transform duration-150";
      direction.style.transformOrigin = "50% 100%";

      const dot = document.createElement("div");
      dot.className =
        "h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-[0_0_0_6px_rgba(59,130,246,0.35)]";

      container.appendChild(direction);
      container.appendChild(dot);

      positionMarkerDirectionRef.current = direction;

      const marker = new maplibreRef.current.Marker({
        element: container,
        anchor: "center",
      }).addTo(mapRef.current);
      positionMarkerRef.current = marker;
    }

    positionMarkerRef.current
      ?.setLngLat([userPosition.lng, userPosition.lat])
      .addTo(mapRef.current);

    updateMarkerHeading(heading);
  }, [
    heading,
    mapRef,
    maplibreRef,
    removePositionMarker,
    updateMarkerHeading,
    userPosition,
  ]);

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
      map.on("error", event => {
        const err: any = event?.error;
        const status = err?.status ?? err?.statusCode;
        const message = typeof err?.message === "string" ? err.message : "";
        if (status === 404 || /404/.test(message)) {
          console.debug("Raster tile missing", { status, message });
          event?.preventDefault?.();
        }
      });

      map.on("load", () => {
        RASTER_LAYERS.forEach(layer => {
          const sourceId = `raster-${layer.id}`;
          if (!map.getSource || map.getSource(sourceId)) return;
          map.addSource(sourceId, {
            type: "raster",
            tiles: [layer.url],
            tileSize: 256,
            minzoom: layer.minzoom,
            maxzoom: layer.maxzoom,
          });
          map.addLayer({
            id: `raster-layer-${layer.id}`,
            type: "raster",
            source: sourceId,
            paint: {
              "raster-opacity": layer.opacity,
            },
            layout: {
              visibility: layer.isVisible ? "visible" : "none",
            },
          });
        });
        applyRasterVisibility(map, selected);
        const boundsToFit = effectiveBounds;
        if (boundsToFit) {
          const maxZoom = RASTER_LAYERS.reduce((acc, layer) => Math.max(acc, layer.maxzoom), 0);
          map.fitBounds(boundsToFit, {
            padding: 48,
            maxZoom: maxZoom || 16,
            duration: 0,
          });
        }
        setMapReady(true);
      });
      if (typeof map.resize === "function") {
        requestAnimationFrame(() => {
          map.resize();
          requestAnimationFrame(() => map.resize());
        });
      }
      const canvas = map.getCanvas();
      canvas.style.cursor = `url(${logo}) 16 16, auto`;

      map.on("click", handleMapClick);

      if (userPositionRef.current) {
        const latest = userPositionRef.current;
        recenterOnPosition(latest);
        setUserPosition({ ...latest });
      }
    });
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, [applyRasterVisibility, handleMapClick, recenterOnPosition, setUserPosition]);

  return (
    <motion.section
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="flex h-dvh max-h-dvh flex-col overflow-hidden p-3"
    >
      <div className="mb-3 flex shrink-0 items-center gap-2">
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

      <div className="relative flex-1 min-h-[320px] overflow-hidden rounded-2xl border border-secondary bg-secondary dark:border-secondary dark:bg-secondary">
        <div
          ref={mapContainer}
          className="absolute inset-0 h-full w-full"
          style={{ cursor: `url(${logo}) 16 16, auto` }}
        />

        {gpsFollow && userPosition && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => recenterOnPosition()}
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
          <div className="absolute left-3 top-56 sm:top-48 flex flex-col space-y-2">
            <AnimatePresence initial={false}>
              {toasts.map(toast => (
                <Toast
                  key={toast.id}
                  message={toast.text}
                  details={toast.details}
                  onClick={() => {
                    if (toast.zone) {
                      onZone(toast.zone);
                    }
                    setToasts(curr => curr.filter(t => t.id !== toast.id));
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      <div className="mt-4 shrink-0">
        <div className="relative -mx-3 sm:-mx-6 px-3 sm:px-6">
          <div className="relative overflow-hidden rounded-[28px] border border-white/40 dark:border-white/10 bg-gradient-to-br from-white/95 via-white/75 to-white/95 dark:from-slate-900/80 dark:via-slate-900/65 dark:to-slate-900/80 backdrop-blur-2xl shadow-[0_28px_60px_-30px_rgba(15,23,42,0.55)]">
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory flex-nowrap no-scrollbar px-5 py-4">
              {MUSHROOMS.map(m => (
                <Button
                  key={m.id}
                  onClick={() => toggleShroom(m.id)}
                  className={classNames(BTN, "shrink-0 snap-start")}
                  variant={selected.includes(m.id) ? "primary" : "secondary"}
                >
                  {m.name}
                </Button>
              ))}
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white via-white/70 to-transparent dark:from-slate-900/80 dark:via-slate-900/60"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white via-white/70 to-transparent dark:from-slate-900/80 dark:via-slate-900/60"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
