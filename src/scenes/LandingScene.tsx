import React from "react";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BTN, BTN_GHOST_ICON, T_MUTED } from "../styles/tokens";
import { useT } from "../i18n";
import logo from "@/assets/logo.png";

export default function LandingScene({
  onSeeMap,
  onMySpots,
  onOpenSettings,
  onOpenPicker,
}: {
  onSeeMap: () => void;
  onMySpots: () => void;
  onOpenSettings: () => void;
  onOpenPicker: () => void;
}) {
  const { t } = useT();
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ willChange: "opacity" }}
      className="relative min-h-screen overflow-hidden bg-background text-foreground"
    >
      <div className="absolute top-3 right-3 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSettings}
          className={BTN_GHOST_ICON}
          aria-label={t("Réglages")}
        >
          <Settings className="w-7 h-7" />
        </Button>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-40 left-1/2 w-[60rem] h-[60rem] -translate-x-1/2 rounded-full bg-forest/30 blur-3xl"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ willChange: "transform" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 w-[80rem] h-[80rem] -translate-x-1/2 rounded-full bg-moss/20 blur-3xl mix-blend-multiply"
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{ willChange: "transform" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ willChange: "transform, opacity" }}
          className="max-w-xl p-10"
        >
          <img
            src={logo}
            alt={t("Logo")}
            className="mx-auto mb-8 w-28 h-28 rounded-[2rem] shadow-lg"
          />
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-forest">
            <span className="block">
              {t("Trouvez vos coins à champignons comestibles,")}
            </span>
            <span className="block">{t("même sans réseau.")}</span>
          </h1>
          <p className={`mt-6 text-lg ${T_MUTED}`}>
            {t("Mini‑pack offline inclus : carte topo (50 km) + fiches Cèpe, Girolle, Morille.")}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button onClick={onSeeMap} className={BTN}>
              {t("Voir la carte")}
            </Button>
            <Button onClick={onMySpots} className={BTN}>
              {t("Mes coins")}
            </Button>
            <Button onClick={onOpenPicker} className={BTN}>
              {t("Les champignons")}
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
