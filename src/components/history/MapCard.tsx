import React, { useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { loadMap } from "@/services/openstreetmap";
import type { StyleSpecification } from "maplibre-gl";
import { useT } from "@/i18n";

export function MapCard({ center }: { center: [number, number] }) {
  const { t } = useT();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  useEffect(() => {
    if (!mapContainer.current) return;
    const [lat, lng] = center;
    loadMap().then(maplibregl => {
      const style: StyleSpecification = {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: t("© OpenStreetMap contributors | MapLibre"),
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
        container: mapContainer.current as HTMLDivElement,
        style,
        center: [lng, lat],
        zoom: 12,
        attributionControl: false,
      });
      mapRef.current = map;
      new maplibregl.Marker().setLngLat([lng, lat]).addTo(map);
    });
    return () => mapRef.current?.remove();
  }, [center]);
  const [lat, lng] = center;
  return (
    <Card className="h-full p-4 lg:p-6">
      <CardHeader className="p-0 mb-4 border-none">
        <CardTitle>{t("Carte du coin")}</CardTitle>
        <p className="text-sm text-foreground/70">{t("La carte affiche l'historique complet avec détails.")}</p>
      </CardHeader>
      <CardContent className="p-0">
        <div
          className="relative rounded-md border border-border overflow-hidden aspect-video"
          role="img"
          aria-label={t("Carte de l'emplacement situé aux coordonnées latitude {lat}, longitude {lng}", { lat, lng })}
        >
          <div ref={mapContainer} className="absolute inset-0" />
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end">
        <p className="text-xs text-foreground/50">{t("© OpenStreetMap contributors | MapLibre")}</p>
      </CardFooter>
    </Card>
  );
}

export default MapCard;
