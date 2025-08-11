import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export async function loadMap() {
  return maplibregl;
}

export function getStaticMapUrl(lat: number, lng: number, width = 400, height = 160, zoom = 13) {
  // StaticMap from staticmap.openstreetmap.de sometimes returns 403 depending
  // on the execution environment. To avoid relying on that service, build a
  // URL pointing directly to the OpenStreetMap tile server. We compute the
  // tile x/y for the given lat/lng and zoom. The returned tile is 256×256px
  // and will be scaled by the caller via CSS.
  const xtile = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
  const ytile = Math.floor(
    ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
      Math.pow(2, zoom)
  );
  return `https://tile.openstreetmap.org/${zoom}/${xtile}/${ytile}.png`;
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
