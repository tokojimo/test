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

export const loadMushrooms = async () => {
  try {
    return await fetchJSON<Mushroom[]>("/data/mushrooms.json");
  } catch (err) {
    alert("Impossible de charger les champignons.");
    return [];
  }
};

export const loadZones = async () => {
  try {
    return await fetchJSON<Zone[]>("/data/zones.json");
  } catch (err) {
    alert("Impossible de charger les zones.");
    return [];
  }
};

export const loadLegend = async () => {
  try {
    return await fetchJSON<{ label: string; color: string }[]>("/data/legend.json");
  } catch (err) {
    alert("Impossible de charger la légende.");
    return [];
  }
};

export default { loadMushrooms, loadZones, loadLegend };
