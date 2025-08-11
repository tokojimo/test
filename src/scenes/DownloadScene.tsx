import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { BTN, BTN_GHOST_ICON, T_PRIMARY, T_MUTED, T_SUBTLE } from "../styles/tokens";
import { Row } from "../components/Row";
import { useT } from "../i18n";
import { DEMO_ZONES } from "../data/zones";
import type { Zone } from "../types";

export default function DownloadScene({ packSize, setPackSize, deviceFree, setDeviceFree, includeRelief, setIncludeRelief, includeWeather, setIncludeWeather, downloading, dlProgress, onStart, onCancel, onBack }: { packSize: number; setPackSize: (n: number) => void; deviceFree: number; setDeviceFree: (n: number) => void; includeRelief: boolean; setIncludeRelief: (v: boolean) => void; includeWeather: boolean; setIncludeWeather: (v: boolean) => void; downloading: boolean; dlProgress: number; onStart: () => void; onCancel: () => void; onBack: () => void }) {
  const { t } = useT();
  const [search, setSearch] = useState("");
  const [zone, setZone] = useState<Zone | null>(null);
  const matches = useMemo(
    () =>
      DEMO_ZONES.filter(z =>
        z.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );
  useEffect(() => {
    const base = 120;
    const size = base + (includeRelief ? 30 : 0) + (includeWeather ? 30 : 0);
    setPackSize(size);
  }, [includeRelief, includeWeather, setPackSize]);

  return (
    <motion.section initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="p-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t("Rechercher une zone…")}
            className={`pl-9 bg-secondary border-secondary dark:bg-secondary dark:border-secondary ${T_PRIMARY}`}
          />
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${T_MUTED}`} />
          {search && matches.length > 0 && (
            <ul className="absolute z-10 left-0 right-0 mt-1 max-h-40 overflow-auto rounded-xl border border-secondary dark:border-secondary bg-secondary dark:bg-secondary">
              {matches.map(z => (
                <li key={z.id}>
                  <button
                    onClick={() => {
                      setZone(z);
                      setSearch("");
                    }}
                    className={`w-full text-left px-3 py-1 ${T_PRIMARY} hover:bg-secondary dark:hover:bg-secondary`}
                  >
                    {z.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onBack} className={BTN_GHOST_ICON} aria-label={t("Retour")}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
      </div>
      <div className="relative h-[50vh] rounded-2xl border border-secondary dark:border-secondary overflow-hidden bg-[conic-gradient(at_30%_30%,#14532d,#052e16,#14532d)] bg-secondary dark:bg-secondary">
        <div className="absolute inset-6 border-2 border-red-600 rounded-xl" />
        <div className={`absolute top-3 left-3 bg-secondary/80 dark:bg-secondary/80 rounded-xl px-3 py-1 text-sm ${T_PRIMARY}`}>
          {zone ? zone.name : t("Vue actuelle")}
        </div>
      </div>

      <div className="mt-3 grid md:grid-cols-2 gap-3">
        <Card className="bg-secondary dark:bg-secondary border border-secondary dark:border-secondary rounded-2xl">
          <CardContent className="pt-4 space-y-2">
            <Row label={t("Taille estimée")} value={`${packSize} Mo`} />
            <Row label={t("Espace disponible")} value={`${deviceFree} Mo`} />
            <Row label={t("Temps estimé")} value="~ 45 s" />
            <div className="flex items-center justify-between">
              <div className={`text-sm ${T_PRIMARY}`}>{t("Inclure relief / altitudes")}</div>
              <Switch checked={includeRelief} onCheckedChange={setIncludeRelief} />
            </div>
            <div className="flex items-center justify-between">
              <div className={`text-sm ${T_PRIMARY}`}>{t("Inclure prévisions météo locales")}</div>
              <Switch checked={includeWeather} onCheckedChange={setIncludeWeather} />
            </div>
            {!downloading ? (
              <div className="flex gap-2">
                <Button onClick={onStart} className={`${BTN} flex-1`}>
                  <Download className="w-4 h-4 mr-2" />
                  {t("Télécharger")}
                </Button>
                <Button variant="ghost" onClick={onCancel} className={`flex-1 rounded-xl hover:bg-secondary dark:hover:bg-secondary ${T_PRIMARY}`}>
                  {t("Annuler")}
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Progress value={dlProgress} />
                <div className={`text-xs ${T_MUTED}`}>{Math.round(dlProgress)}%</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-secondary dark:bg-secondary border border-secondary dark:border-secondary rounded-2xl">
          <CardHeader>
            <CardTitle className={T_PRIMARY}>{t("États possibles")}</CardTitle>
          </CardHeader>
          <CardContent className={`text-sm ${T_MUTED} space-y-1`}>
            <div>• {t("Succès → « Carte téléchargée et prête hors‑ligne »")}</div>
            <div>• {t("Échec réseau → « Téléchargement interrompu – reprendra automatiquement »")}</div>
            <div>• {t("Manque d'espace → « Espace insuffisant. Libérez n Mo »")}</div>
            <div className={`text-xs ${T_SUBTLE}`}>
              {t("Les cartes incluent les données des 3 champignons par défaut.")}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
}
