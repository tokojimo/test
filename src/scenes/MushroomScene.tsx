import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Calendar, Trees, CloudSun, Info, ChefHat, Sandwich, AlertTriangle, Compass, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InfoBlock } from "../components/InfoBlock";
import { BTN, BTN_GHOST_ICON, GLASS_CARD, T_PRIMARY, T_SUBTLE } from "../styles/tokens";
import { useT } from "../i18n";
import type { Mushroom } from "../types";

export default function MushroomScene({ item, onSeeZones, onBack }: { item: Mushroom; onSeeZones: () => void; onBack: () => void }) {
  const { t } = useT();
  if (!item) return <div className={`p-6 ${T_PRIMARY}`}>{t("Sélectionnez un champignon…")}</div>;
  return (
    <motion.section initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="p-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className={`${BTN_GHOST_ICON} mb-3`}
        aria-label={t("Retour")}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <div className={`overflow-hidden ${GLASS_CARD}`}>
        <img src={item.photo} className="h-60 w-full object-cover" />
        <div className="p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className={`text-xl font-semibold ${T_PRIMARY}`}>{item.name}</h2>
            <Badge>{item.latin}</Badge>
            {item.edible ? (
              <Badge className="bg-emerald-700">🍴 {t("comestible")}</Badge>
            ) : (
              <Badge className="bg-red-700">☠️ {t("toxique")}</Badge>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InfoBlock icon={<Calendar className="w-4 h-4" />} title={t("Saison")} text={item.season} />
            <InfoBlock icon={<Trees className="w-4 h-4" />} title={t("Habitat")} text={item.habitat} />
            <InfoBlock icon={<CloudSun className="w-4 h-4" />} title={t("Météo idéale")} text={item.weatherIdeal} />
            <InfoBlock icon={<Info className="w-4 h-4" />} title={t("Description rapide")} text={item.description} />
            <InfoBlock
              icon={<ChefHat className="w-4 h-4" />}
              title={t("Valeur culinaire + conseils")}
              text={`${item.culinary}. ${item.cookingTips}`}
            />
            <InfoBlock icon={<Sandwich className="w-4 h-4" />} title={t("Exemples de plats")} text={item.dishes.join(" • ")} />
            <InfoBlock
              icon={<AlertTriangle className="w-4 h-4" />}
              title={t("Confusions possibles")}
              text={item.confusions.join(" • ")}
            />
            <InfoBlock icon={<Compass className="w-4 h-4" />} title={t("Conseils cueillette")} text={item.picking} />
          </div>

          {item.edible && (
            <Button onClick={onSeeZones} className={BTN}>
              <MapPin className="w-4 h-4 mr-2" />
              {t("Voir zones optimales")}
            </Button>
          )}
          <p className={`text-xs ${T_SUBTLE}`}>{t("Fiche complète consultable hors‑ligne.")}</p>
        </div>
      </div>
    </motion.section>
  );
}
