import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BTN, BTN_GHOST_ICON, T_PRIMARY, T_MUTED, T_SUBTLE, PAGE } from "../styles/tokens";
import { useT } from "../i18n";
import type { Mushroom } from "../types";

export default function PickerScene({ items, search, setSearch, onPick, onBack }: { items: Mushroom[]; search: string; setSearch: (v: string) => void; onPick: (m: Mushroom) => void; onBack: () => void }) {
  const [seasonFilter, setSeasonFilter] = useState("toutes");
  const [valueFilter, setValueFilter] = useState("toutes");
  const { t } = useT();
  return (
    <motion.section initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className={`p-3 ${PAGE}`}>
      <div className="grid md:grid-cols-4 gap-2 mb-3 items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className={BTN_GHOST_ICON} aria-label={t("Retour")}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("Rechercher un champignon…")}
          className={`bg-secondary border-secondary dark:bg-secondary dark:border-secondary ${T_PRIMARY}`}
        />
        <select value={seasonFilter} onChange={(e) => setSeasonFilter(e.target.value)} className="bg-secondary border border-secondary text-primary dark:bg-secondary dark:border-secondary dark:text-primary rounded-xl px-3 py-2 text-sm">
          <option value="toutes">{t("Toutes saisons")}</option>
          <option>{t("Printemps")}</option>
          <option>{t("Été")}</option>
          <option>{t("Automne")}</option>
        </select>
        <select value={valueFilter} onChange={(e) => setValueFilter(e.target.value)} className="bg-secondary border border-secondary text-primary dark:bg-secondary dark:border-secondary dark:text-primary rounded-xl px-3 py-2 text-sm">
          <option value="toutes">{t("Toute valeur")}</option>
          <option>{t("Excellente")}</option>
          <option>{t("Bonne")}</option>
          <option>{t("Moyenne")}</option>
        </select>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {items.map(m => (
          <button key={m.id} onClick={() => onPick(m)} className="text-left bg-secondary dark:bg-secondary border border-secondary dark:border-secondary rounded-2xl overflow-hidden hover:border-secondary dark:hover:border-secondary">
            <img src={m.photo} className="w-full h-40 object-cover" />
            <div className="p-3">
              <div className={`font-medium ${T_PRIMARY}`}>{m.name}</div>
              <div className={`text-xs ${T_MUTED}`}>{t("Saison :")} {m.season}</div>
            </div>
          </button>
        ))}
      </div>
      <p className={`text-xs mt-2 ${T_SUBTLE}`}>
        {t("Hors‑ligne : Cèpe, Girolle et Morille apparaissent par défaut.")}
      </p>
    </motion.section>
  );
}
