import { MUSHROOMS } from "../data/mushrooms";
import { DEMO_ZONES } from "../data/zones";
import { LEGEND } from "../data/legend";

/**
 * Service de chargement des données.
 * Tente de récupérer les informations depuis des fichiers JSON
 * et retombe sur les données statiques si la requête échoue.
 */
export async function loadMushrooms() {
  try {
    const res = await fetch("/data/mushrooms.json");
    if (res.ok) return await res.json();
  } catch {}
  return MUSHROOMS;
}

export async function loadZones() {
  try {
    const res = await fetch("/data/zones.json");
    if (res.ok) return await res.json();
  } catch {}
  return DEMO_ZONES;
}

export async function loadLegend() {
  try {
    const res = await fetch("/data/legend.json");
    if (res.ok) return await res.json();
  } catch {}
  return LEGEND;
}

