import type { Zone } from "../types";

export const DEMO_ZONES: Zone[] = [
  { id: "zone-alpage", name: "Clairière des Alpages", score: 88, species: { cepe_de_bordeaux: 90, girolle: 75, morille_commune: 0 }, trend: "⬈ amélioration", coords: [45.9, 6.6] },
  { id: "zone-ripisylve", name: "Ripisylve du Vieux Pont", score: 72, species: { cepe_de_bordeaux: 40, girolle: 55, morille_commune: 85 }, trend: "⬊ en baisse", coords: [45.7, 5.9] },
  { id: "zone-lisiere", name: "Grande Lisière Sud", score: 53, species: { cepe_de_bordeaux: 60, girolle: 50, morille_commune: 15 }, trend: "→ stable", coords: [45.6, 6.1] }
];
