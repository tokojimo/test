import React, { useEffect, useRef } from "react";
import { useT } from "@/i18n";
import { T_PRIMARY, T_MUTED } from "@/styles/tokens";
import { loadMap } from "@/services/openstreetmap";
import Logo from "@/assets/logo.png";

interface LocationSectionProps {
  location: string;
  setLocation: (v: string) => void;
}

export function LocationSection({ location, setLocation }: LocationSectionProps) {
  const { t } = useT();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;
    loadMap().then((maplibregl) => {
      const map = new maplibregl.Map({
        container: mapContainerRef.current as HTMLDivElement,
        style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
        center: [2.3522, 48.8566],
        zoom: 10,
      });
      mapRef.current = map;
      map.on("load", () => map.resize());

      const updateLocation = () => {
        const c = map.getCenter();
        setLocation(`${c.lat.toFixed(5)}, ${c.lng.toFixed(5)}`);
      };

      updateLocation();
      map.on("moveend", updateLocation);
    });
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [setLocation]);

  return (
    <div>
      <div className={`text-sm mb-1 ${T_PRIMARY}`}>{t("Localisation")}</div>
      <div className="relative h-48 rounded-xl border border-neutral-400 dark:border-neutral-700 bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
        <img
          src={Logo}
          className="absolute left-1/2 top-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />
      </div>
      <div className={`text-xs mt-1 ${T_MUTED}`}>{t("Déplacez la carte pour choisir la localisation")}</div>
      <div className={`text-xs mt-1 ${T_PRIMARY}`}>{location}</div>
    </div>
  );
}

export default LocationSection;
