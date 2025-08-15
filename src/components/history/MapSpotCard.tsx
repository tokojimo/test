import React, { useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loadMap } from "@/services/openstreetmap";
import type { StyleSpecification } from "maplibre-gl";
import logo from "@/assets/logo.png";
import { useT } from "@/i18n";

export function MapSpotCard({ center }: { center: [number, number] }) {
  const { t } = useT();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    const [lat, lng] = center;
    loadMap().then((maplibregl) => {
      const style: StyleSpecification = {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
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
      const el = document.createElement("img");
      el.src = logo;
      el.className = "w-6 h-6";
      new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([lng, lat])
        .addTo(map);
    });
    return () => mapRef.current?.remove();
  }, [center]);

  const [lat, lng] = center;
  const openRoute = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  return (
    <Card className="h-full p-4 lg:p-6 flex flex-col">
      <CardHeader className="p-0 mb-4 border-none">
        <CardTitle>{t("Carte du spot")}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <div
          className="relative rounded-md border border-border overflow-hidden aspect-video"
          role="img"
          aria-label={t("Carte de l'emplacement situé aux coordonnées latitude {lat}, longitude {lng}", { lat, lng })}
        >
          <div ref={mapContainer} className="absolute inset-0" />
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end">
        <Button variant="secondary" onClick={openRoute}>
          {t("Itinéraire")}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default MapSpotCard;

