import type { Mushroom, Zone } from "../types";

export async function fetchJSON<T>(url: string, fallback?: T): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to load ${url}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Network error while fetching ${url}`);
  }
}

export const loadMushrooms = () =>
  fetchJSON<Mushroom[]>("/data/mushrooms.json");

export const loadZones = () =>
  fetchJSON<Zone[]>("/data/zones.json");

export const loadLegend = () =>
  fetchJSON<{ label: string; color: string }[]>("/data/legend.json");

export default { loadMushrooms, loadZones, loadLegend };
