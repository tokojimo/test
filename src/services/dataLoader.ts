import type { Mushroom, Zone } from "../types";

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load ${url}`);
  }
  return res.json() as Promise<T>;
}

export const loadMushrooms = () => fetchJSON<Mushroom[]>("/data/mushrooms.json");
export const loadZones = () => fetchJSON<Zone[]>("/data/zones.json");
export const loadLegend = () => fetchJSON<{ label: string; color: string }[]>("/data/legend.json");

export default { loadMushrooms, loadZones, loadLegend };
