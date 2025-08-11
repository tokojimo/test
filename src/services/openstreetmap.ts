import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export async function loadMap() {
  return maplibregl;
}

export function getStaticMapUrl(lat: number, lng: number, width = 400, height = 160, zoom = 13) {
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}`;
}
