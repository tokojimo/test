import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export async function loadMap() {
  return maplibregl;
}

export function getStaticMapUrl(lat: number, lng: number, width = 400, height = 160, zoom = 13) {
  return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}`;
}

export async function geocode(query: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((d: any) => ({
      lat: parseFloat(d.lat),
      lon: parseFloat(d.lon),
      name: d.display_name,
    }));
  } catch {
    return [];
  }
}

export async function reverseGeocode(lat: number, lon: number) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const addr = data.address || {};
    return (
      addr.hamlet ||
      addr.village ||
      addr.town ||
      addr.city ||
      addr.locality ||
      addr.county ||
      data.display_name ||
      null
    );
  } catch {
    return null;
  }
}
