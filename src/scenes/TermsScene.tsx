import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BTN_GHOST_ICON, T_PRIMARY, T_MUTED } from "../styles/tokens";
import { useT } from "../i18n";

export default function TermsScene({ onBack }: { onBack: () => void }) {
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
      <h1 className={`text-xl font-bold ${T_PRIMARY}`}>
        {t("Conditions d'utilisation")}
      </h1>
      <p className={`text-sm ${T_MUTED}`}>
        {t("En utilisant cette application, vous acceptez les conditions suivantes.")}
      </p>
      <p className={`text-sm ${T_MUTED}`}>
        {t("L'utilisation doit respecter les lois locales et les réglementations.")}
      </p>
      <p className={`text-sm ${T_MUTED}`}>
        {t("Les auteurs ne peuvent être tenus responsables de l'usage de l'application.")}
      </p>
      <p className={`text-sm ${T_MUTED}`}>
        {t("L'application est fournie en l'état, sans garantie d'aucune sorte.")}
      </p>
    </motion.section>
  );
}
