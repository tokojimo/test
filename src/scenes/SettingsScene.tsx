import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BTN, BTN_GHOST_ICON, T_PRIMARY, T_MUTED } from "../styles/tokens";
import { ToggleRow } from "../components/ToggleRow";
import { SelectRow } from "../components/SelectRow";
import { useAppContext } from "../context/AppContext";
import { useT } from "../i18n";

export default function SettingsScene({ onOpenPacks, onBack }: { onOpenPacks: () => void; onBack: () => void }) {
  const { state, dispatch } = useAppContext();
  const { alerts, prefs } = state;
  const { t } = useT();
  return (
    <motion.section initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="p-3 space-y-3">
      <Button variant="ghost" size="icon" onClick={onBack} className={BTN_GHOST_ICON} aria-label={t("Retour")}>
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Card className="bg-neutral-900 border-neutral-800 rounded-2xl">
        <CardHeader>
          <CardTitle className={T_PRIMARY}>{t("Cartes hors‑ligne")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className={`font-medium ${T_PRIMARY}`}>{t("Pack initial (50 km)")}</div>
              <div className={`text-xs ${T_MUTED}`}>{t("Topo + Cèpe/Girolle/Morille")}</div>
            </div>
            <Button onClick={onOpenPacks} className={BTN}>
              <Download className="w-4 h-4 mr-2" />
              {t("Télécharger une zone")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-800 rounded-2xl">
        <CardHeader>
          <CardTitle className={T_PRIMARY}>{t("Alertes")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ToggleRow
            label={t("Optimum prévu")}
            checked={alerts.optimum}
            onChange={(v) => dispatch({ type: "setAlerts", alerts: { optimum: v } })}
          />
          <ToggleRow
            label={t("Nouvelle zone proche")}
            checked={alerts.newZone}
            onChange={(v) => dispatch({ type: "setAlerts", alerts: { newZone: v } })}
          />
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-800 rounded-2xl">
        <CardHeader>
          <CardTitle className={T_PRIMARY}>{t("Préférences")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <SelectRow
            label={t("Unités")}
            value={prefs.units}
            options={[
              { value: "métriques", label: t("métriques") },
              { value: "impériales", label: t("impériales") },
            ]}
            onChange={(v) => dispatch({ type: "setPrefs", prefs: { units: v } })}
          />
          <SelectRow
            label={t("Thème")}
            value={prefs.theme}
            options={[
              { value: "auto", label: t("auto") },
              { value: "clair", label: t("clair") },
              { value: "sombre", label: t("sombre") },
            ]}
            onChange={(v) => dispatch({ type: "setPrefs", prefs: { theme: v } })}
          />
          <ToggleRow
            label={t("GPS")}
            checked={prefs.gps}
            onChange={(v) => dispatch({ type: "setPrefs", prefs: { gps: v } })}
          />
          <SelectRow
            label={t("Langue")}
            value={prefs.lang}
            options={[
              { value: "fr", label: t("français") },
              { value: "en", label: t("anglais") },
            ]}
            onChange={(v) => dispatch({ type: "setPrefs", prefs: { lang: v } })}
          />
        </CardContent>
      </Card>

      <div className={`text-sm ${T_MUTED}`}>
        {t("« À propos » • « Conseils de cueillette »")}
      </div>
    </motion.section>
  );
}
