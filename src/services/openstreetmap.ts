import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export async function loadMap() {
  return maplibregl;
}

export function getStaticMapUrl(lat: number, lng: number, width = 400, height = 160, zoom = 13) {
  // Build a static tile URL using the same Carto "positron" style as the
  // interactive map. We pick the tile whose center is closest to the given
  // coordinates so that the returned image shows roughly centered content
  // without changing map style.
  const xtileF = ((lng + 180) / 360) * Math.pow(2, zoom);
  const ytileF =
    ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
    Math.pow(2, zoom);
  const xtile = Math.round(xtileF);
  const ytile = Math.round(ytileF);
  const scale = Math.min(2, Math.ceil(Math.max(width, height) / 256));
  const suffix = scale > 1 ? `@${scale}x` : "";
  const sub = ["a", "b", "c", "d"][Math.floor(Math.random() * 4)];
  return `https://${sub}.basemaps.cartocdn.com/light_all/${zoom}/${xtile}/${ytile}${suffix}.png`;
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
