import React from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MushroomIcon } from "../components/MushroomIcon";
import { BTN, BTN_GHOST_ICON, T_MUTED } from "../styles/tokens";
import { useT } from "../i18n";

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
      className="relative min-h-screen overflow-hidden"
    >
      <div className="absolute top-3 right-3 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSettings}
          className={BTN_GHOST_ICON}
          aria-label={t("Réglages")}
        >
          <Menu className="w-7 h-7" />
        </Button>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-[40rem] h-[40rem] rounded-full bg-primary/30 blur-3xl"
          animate={{ y: [0, 40, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-[40rem] h-[40rem] rounded-full bg-secondary/30 blur-3xl"
          animate={{ y: [0, -40, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-3xl backdrop-blur-xl bg-background/60 border border-border/50 shadow-2xl"
        >
          <div className="mx-auto mb-6 w-24 h-24 rounded-2xl bg-primary/20 grid place-items-center shadow-lg">
            <MushroomIcon className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-br from-primary via-emerald-300 to-primary bg-clip-text text-transparent">
            {t("Trouvez vos coins à champignons comestibles, même sans réseau.")}
          </h1>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
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
          <p className={`mt-8 text-sm ${T_MUTED}`}>
            {t("Mini‑pack offline inclus : carte topo (50 km) + fiches Cèpe, Girolle, Morille.")}
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
