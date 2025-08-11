import React from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MushroomIcon } from "../components/MushroomIcon";
import { BTN, BTN_GHOST_ICON, T_PRIMARY, T_MUTED } from "../styles/tokens";
import { useT } from "../i18n";
import { useAuth } from "../context/AuthContext";

export default function LandingScene({
  onSeeMap,
  onMySpots,
  onOpenSettings,
  onOpenPicker,
  onLogin,
  onSignup,
  onPremium,
}: {
  onSeeMap: () => void;
  onMySpots: () => void;
  onOpenSettings: () => void;
  onOpenPicker: () => void;
  onLogin: () => void;
  onSignup: () => void;
  onPremium: () => void;
}) {
  const { t } = useT();
  const { user } = useAuth();
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative min-h-[calc(100vh-0px)]">
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

      <img
        src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1920&auto=format&fit=crop"
        alt={t("forêt brumeuse")}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="mx-auto mb-6 w-20 h-20 rounded-2xl bg-secondary/60 dark:bg-secondary/60 border border-secondary dark:border-secondary grid place-items-center shadow-xl">
          <MushroomIcon className={T_PRIMARY} />
        </div>
        <h1 className={`text-3xl font-semibold ${T_PRIMARY}`}>
          {t("Trouvez vos coins à champignons comestibles, même sans réseau.")}
        </h1>
        <div className="mt-6 flex items-center justify-center gap-3">
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
        {!user ? (
          <div className="mt-3 flex items-center justify-center gap-3">
            <Button onClick={onLogin} className={BTN}>
              {t("Se connecter")}
            </Button>
            <Button onClick={onSignup} className={BTN}>
              {t("Créer un compte")}
            </Button>
          </div>
        ) : (
          <div className="mt-3 flex justify-center">
            <Button onClick={onPremium} className={BTN}>
              {user.premium ? t("Compte premium") : t("Passer en premium")}
            </Button>
          </div>
        )}
        <p className={`mt-8 text-sm ${T_MUTED}`}>
          {t("Mini‑pack offline inclus : carte topo (50 km) + fiches Cèpe, Girolle, Morille.")}
        </p>
      </div>
    </motion.section>
  );
}
