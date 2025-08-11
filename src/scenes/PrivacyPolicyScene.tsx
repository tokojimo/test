import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BTN_GHOST_ICON, T_PRIMARY, T_MUTED } from "../styles/tokens";
import { useT } from "../i18n";

export default function PrivacyPolicyScene({ onBack }: { onBack: () => void }) {
  const { t } = useT();
  return (
    <motion.section
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="p-3 space-y-3"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className={BTN_GHOST_ICON}
        aria-label={t("Retour")}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <h1 className={`text-xl font-bold ${T_PRIMARY}`}>{t("Politique de confidentialité")}</h1>
      <p className={`text-sm ${T_MUTED}`}>
        {t(
          "Nous ne collectons aucune donnée personnelle. Les informations restent sur votre appareil."
        )}
      </p>
      <p className={`text-sm ${T_MUTED}`}>
        {t(
          "Aucune donnée n'est transmise à des serveurs externes sans votre consentement explicite."
        )}
      </p>
      <p className={`text-sm ${T_MUTED}`}>
        {t("L'utilisation de l'application implique l'acceptation de cette politique.")}
      </p>
    </motion.section>
  );
}
