import React, { useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { loadMap } from "@/services/openstreetmap";
import type { StyleSpecification } from "maplibre-gl";

export function MapCard({ center }: { center: [number, number] }) {
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
            attribution: "© OpenStreetMap contributors | MapLibre",
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
  return (
    <Card className="p-4 lg:p-6">
      <CardHeader className="p-0 mb-4 border-none">
        <CardTitle>Carte du coin</CardTitle>
        <p className="text-sm text-foreground/70">La carte affiche l’historique complet avec détails.</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full rounded-md border border-border overflow-hidden aspect-video">
          <div ref={mapContainer} className="absolute inset-0" />
        </div>
        <div className="mt-2 text-[10px] text-foreground/50 text-right">© OpenStreetMap contributors | MapLibre</div>
      </CardContent>
    </Card>
  );
}

export default MapCard;
