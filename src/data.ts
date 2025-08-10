import type { Mushroom, Zone } from "./types";

export const MUSHROOMS: Mushroom[] = [
  { id: "cepe", name: "Cèpe de Bordeaux", latin: "Boletus edulis", edible: true, season: "Août – Novembre", habitat: "Feuillus & conifères, sols acides, 200–1200 m, lisières et clairières", weatherIdeal: "Pluies modérées suivies de 3–5 jours doux (12–20°C), vent faible", description: "Chapeau brun-noisette, pied ventru réticulé, tubes blancs devenant verdâtres, chair blanche", culinary: "Excellente. Poêlé, en fricassée, séchage possible", cookingTips: "Saisir à feu vif dans un peu de matière grasse, ne pas laver à grande eau (brosse + chiffon)", dishes: ["Omelette aux cèpes", "Poêlée de cèpes persillés", "Tagliatelles aux cèpes", "Cèpes rôtis au four"], confusions: ["Bolet amer (Tylopilus felleus)", "Bolets à pores rouges (toxiques)"], picking: "Couper au couteau, reboucher le trou, prélever raisonnablement", photo: "https://images.unsplash.com/photo-1603296196270-937b36cf47b1?q=80&w=1600&auto=format&fit=crop" },
  { id: "girolle", name: "Girolle (Chanterelle)", latin: "Cantharellus cibarius", edible: true, season: "Juin – Octobre", habitat: "Bois de conifères & feuillus, mousses, pentes bien drainées", weatherIdeal: "Alternance d'averses et de beaux jours, 14–22°C", description: "Chapeau jaune cône-ombiliqué, plis décurrents, odeur fruitée d'abricot", culinary: "Excellente. Sautés courts, risotto, pickles", cookingTips: "Déposer en fin de cuisson pour conserver le croquant, éviter l'excès d'eau", dishes: ["Risotto aux girolles", "Volaille sauce girolles", "Tartine forestière", "Pickles de girolles"], confusions: ["Clitocybe de l'olivier (toxique)", "Fausse girolle (Hygrophoropsis aurantiaca)"], picking: "Prélever les plus développées, laisser les jeunes", photo: "https://images.unsplash.com/photo-1631460615580-bbbc9efeb800?q=80&w=1600&auto=format&fit=crop" },
  { id: "morille", name: "Morille commune", latin: "Morchella esculenta", edible: true, season: "Mars – Mai", habitat: "Lisières, vergers, ripisylves, sols calcaires", weatherIdeal: "Redoux printanier après pluies, 8–18°C", description: "Chapeau alvéolé en nid d'abeille, pied blanc-creme, chair creuse", culinary: "Excellente mais TOUJOURS bien cuite", cookingTips: "Sécher possible. Réhydrater puis cuire longuement. Jamais crue", dishes: ["Morilles à la crème", "Poulet aux morilles", "Pâtes aux morilles", "Tartes salées aux morilles"], confusions: ["Gyromitre (toxique)", "Morillons (autres Morchella)"], picking: "Gants recommandés pour la cueillette; longue cuisson obligatoire", photo: "https://images.unsplash.com/photo-1587307360679-f20b5cbd9e03?q=80&w=1600&auto=format&fit=crop" }
];

export const DEMO_ZONES: Zone[] = [
  { id: "zone-alpage", name: "Clairière des Alpages", score: 88, species: { cepe: 90, girolle: 75, morille: 0 }, trend: "⬈ amélioration", coords: [45.9, 6.6] },
  { id: "zone-ripisylve", name: "Ripisylve du Vieux Pont", score: 72, species: { cepe: 40, girolle: 55, morille: 85 }, trend: "⬊ en baisse", coords: [45.7, 5.9] },
  { id: "zone-lisiere", name: "Grande Lisière Sud", score: 53, species: { cepe: 60, girolle: 50, morille: 15 }, trend: "→ stable", coords: [45.6, 6.1] }
];

export const LEGEND = [
  { label: ">85", color: "bg-emerald-700" },
  { label: "84–75", color: "bg-emerald-600" },
  { label: "74–50", color: "bg-yellow-600" },
  { label: "49–35", color: "bg-orange-600" },
  { label: "34–25", color: "bg-red-600" }
];
