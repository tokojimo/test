import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  BTN,
  BTN_GHOST_ICON,
  T_PRIMARY,
  T_MUTED,
  T_SUBTLE,
} from "../styles/tokens";
import { useT } from "../i18n";
import type { Mushroom } from "../types";

export default function PickerScene({ items, search, setSearch, onPick, onBack }: { items: Mushroom[]; search: string; setSearch: (v: string) => void; onPick: (m: Mushroom) => void; onBack: () => void }) {
  const [seasonFilter, setSeasonFilter] = useState("toutes");
  const [valueFilter, setValueFilter] = useState("toutes");
  const { t } = useT();
  return (
    <motion.section initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="p-3">
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
        <Select
          value={seasonFilter}
          onChange={(e) => setSeasonFilter(e.target.value)}
          className="bg-secondary border-secondary text-primary dark:bg-secondary dark:border-secondary dark:text-primary rounded-xl"
        >
          <option value="toutes">{t("Toutes saisons")}</option>
          <option>{t("Printemps")}</option>
          <option>{t("Été")}</option>
          <option>{t("Automne")}</option>
        </Select>
        <Select
          value={valueFilter}
          onChange={(e) => setValueFilter(e.target.value)}
          className="bg-secondary border-secondary text-primary dark:bg-secondary dark:border-secondary dark:text-primary rounded-xl"
        >
          <option value="toutes">{t("Toute valeur")}</option>
          <option>{t("Excellente")}</option>
          <option>{t("Bonne")}</option>
          <option>{t("Moyenne")}</option>
        </Select>
      </div>

      <div className="grid-responsive">
        {items.map((m) => (
          <a
            key={m.id}
            href="#"
            role="link"
            onClick={(e) => {
              e.preventDefault();
              onPick(m);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onPick(m);
              }
            }}
            className="block h-full no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <Card className="h-full flex flex-col">
              <img
                src={m.photo}
                alt=""
                className="w-full h-40 object-cover rounded-t-lg"
                loading="lazy"
              />
              <CardContent className="p-3 flex flex-col flex-1">
                <div className={`font-medium ${T_PRIMARY}`}>{m.name}</div>
                <div className={`text-xs ${T_MUTED}`}>
                  {t("Saison :")}{" "}
                  {m.season}
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
      <p className={`text-xs mt-2 ${T_SUBTLE}`}>
        {t("Hors‑ligne : Cèpe, Girolle et Morille apparaissent par défaut.")}
      </p>
    </motion.section>
  );
}
