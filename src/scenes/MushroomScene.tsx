import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Calendar, Trees, CloudSun, Info, ChefHat, Sandwich, TriangleAlert, Compass, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InfoBlock } from "../components/InfoBlock";
import { BTN, BTN_GHOST_ICON, T_PRIMARY, T_SUBTLE } from "../styles/tokens";

export default function MushroomScene({ item, onSeeZones, onBack }: { item: any; onSeeZones: () => void; onBack: () => void }) {
  if (!item) return <div className={`p-6 ${T_PRIMARY}`}>Sélectionnez un champignon…</div>;
  return (
    <motion.section initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="p-3">
      <Button variant="ghost" size="icon" onClick={onBack} className={`${BTN_GHOST_ICON} mb-3`} aria-label="Retour">
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <div className="rounded-2xl overflow-hidden border border-neutral-800">
        <img src={item.photo} className="w-full h-60 object-cover" />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <h2 className={`text-xl font-semibold ${T_PRIMARY}`}>{item.name}</h2>
        <Badge variant="secondary">{item.latin}</Badge>
        {item.edible ? <Badge className="bg-emerald-700">🍴 comestible</Badge> : <Badge className="bg-red-700">☠️ toxique</Badge>}
      </div>

      <div className="grid md:grid-cols-2 gap-3 mt-3">
        <InfoBlock icon={<Calendar className="w-4 h-4" />} title="Saison" text={item.season} />
        <InfoBlock icon={<Trees className="w-4 h-4" />} title="Habitat" text={item.habitat} />
        <InfoBlock icon={<CloudSun className="w-4 h-4" />} title="Météo idéale" text={item.weatherIdeal} />
        <InfoBlock icon={<Info className="w-4 h-4" />} title="Description rapide" text={item.description} />
        <InfoBlock icon={<ChefHat className="w-4 h-4" />} title="Valeur culinaire + conseils" text={`${item.culinary}. ${item.cookingTips}`} />
        <InfoBlock icon={<Sandwich className="w-4 h-4" />} title="Exemples de plats" text={item.dishes.join(" • ")} />
        <InfoBlock icon={<TriangleAlert className="w-4 h-4" />} title="Confusions possibles" text={item.confusions.join(" • ")} />
        <InfoBlock icon={<Compass className="w-4 h-4" />} title="Conseils cueillette" text={item.picking} />
      </div>

      {item.edible && (
        <div className="mt-4">
          <Button onClick={onSeeZones} className={BTN}><MapPin className="w-4 h-4 mr-2" />Voir zones optimales</Button>
        </div>
      )}
      <p className={`text-xs mt-2 ${T_SUBTLE}`}>Fiche complète consultable hors‑ligne.</p>
    </motion.section>
  );
}
