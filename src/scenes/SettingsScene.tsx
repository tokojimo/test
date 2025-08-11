import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BTN, BTN_GHOST_ICON, T_PRIMARY, T_MUTED } from "../styles/tokens";
import { ToggleRow } from "../components/ToggleRow";
import { SelectRow } from "../components/SelectRow";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useT } from "../i18n";

export default function SettingsScene({
  onOpenPacks,
  onOpenPrivacy,
  onOpenTerms,
  onBack,
  onLogin,
  onSignup,
  onPremium,
}: {
  onOpenPacks: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onBack: () => void;
  onLogin: () => void;
  onSignup: () => void;
  onPremium: () => void;
}) {
  const { state, dispatch } = useAppContext();
  const { alerts, prefs } = state;
  const { user, logout } = useAuth();
  const { t } = useT();
  const handleGpsChange = (v: boolean) => {
    if (v) {
      const ok = window.confirm(
        t(
          "La géolocalisation est utilisée pour centrer la carte sur votre position."
        )
      );
      if (!ok) return;
      navigator.geolocation?.getCurrentPosition(() => {}, () => {});
    }
    dispatch({ type: "setPrefs", prefs: { gps: v } });
  };
  const revokeGps = () => {
    navigator.permissions?.revoke({ name: "geolocation" as PermissionName });
    dispatch({ type: "setPrefs", prefs: { gps: false } });
  };
  return (
    <motion.section
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="p-3 space-y-3"
    >
      <Button variant="ghost" size="icon" onClick={onBack} className={BTN_GHOST_ICON} aria-label={t("Retour")}>
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Card className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-2xl">
        <CardHeader>
          <CardTitle className={T_PRIMARY}>{t("Compte")}</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div className="space-y-2">
              <div className={`font-medium ${T_PRIMARY}`}>{user.username}</div>
              {!user.premium ? (
                <Button onClick={onPremium} className={BTN}>
                  {t("Passer en premium")}
                </Button>
              ) : (
                <div className={`text-sm ${T_MUTED}`}>{t("Compte premium")}</div>
              )}
              <Button onClick={logout} className={BTN}>
                {t("Se déconnecter")}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <Button onClick={onLogin} className={BTN}>
                {t("Se connecter")}
              </Button>
              <Button onClick={onSignup} className={BTN}>
                {t("Créer un compte")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-2xl">
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

      <Card className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-2xl">
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

      <Card className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-2xl">
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
            onChange={handleGpsChange}
          />
          <Button onClick={revokeGps} className={BTN}>
            {t("Retirer le consentement")}
          </Button>
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
      <div className={`text-sm ${T_MUTED}`}>
        <button onClick={onOpenPrivacy} className="underline">
          {t("Politique de confidentialité")}
        </button>
      </div>
      <div className={`text-sm ${T_MUTED}`}>
        <button onClick={onOpenTerms} className="underline">
          {t("Conditions d'utilisation")}
        </button>
      </div>
    </motion.section>
  );
}
