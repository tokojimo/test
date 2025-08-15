import React, { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loadMap, getStaticMapUrl } from "@/services/openstreetmap";
import { useT } from "@/i18n";
import Logo from "@/assets/logo.png";

export function MapSpotCard({ center }: { center: [number, number] }) {
  const { t } = useT();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [staticUrl, setStaticUrl] = useState<string | null>(null);

  useEffect(() => {
    const [lat, lng] = center;
    if (!mapContainer.current) {
      setStaticUrl(getStaticMapUrl(lat, lng));
      return;
    }
    loadMap()
      .then(maplibregl => {
        try {
          const map = new maplibregl.Map({
            container: mapContainer.current as HTMLDivElement,
            style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
            center: [lng, lat],
            zoom: 12,
            attributionControl: false,
          });
          mapRef.current = map;
          map.on("error", () => {
            setStaticUrl(getStaticMapUrl(lat, lng));
          });
          const el = document.createElement("img");
          el.src = Logo;
          el.className = "w-6 h-6";
          new maplibregl.Marker({ element: el, anchor: "bottom" })
            .setLngLat([lng, lat])
            .addTo(map);
        } catch {
          setStaticUrl(getStaticMapUrl(lat, lng));
        }
      })
      .catch(() => {
        setStaticUrl(getStaticMapUrl(lat, lng));
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
          {staticUrl ? (
            <img
              src={staticUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div ref={mapContainer} className="absolute inset-0" />
          )}
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

