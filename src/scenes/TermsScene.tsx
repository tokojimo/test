import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BTN_GHOST_ICON, T_PRIMARY, T_MUTED, PAGE } from "../styles/tokens";
import { useT } from "../i18n";

export default function TermsScene({ onBack }: { onBack: () => void }) {
  const { t } = useT();
  return (
    <motion.section
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className={`p-3 space-y-3 ${PAGE}`}
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

      <h2 className={`text-lg font-semibold ${T_PRIMARY}`}>
        {t("1. Acceptation des conditions")}
      </h2>
      <p className={`text-sm ${T_MUTED}`}>
        {t(
          "En accédant à et en utilisant cette application, vous acceptez d'être lié par ces conditions d'utilisation."
        )}
      </p>

      <h2 className={`text-lg font-semibold ${T_PRIMARY}`}>
        {t("2. Utilisation du service")}
      </h2>
      <p className={`text-sm ${T_MUTED}`}>
        {t(
          "Vous acceptez d'utiliser l'application uniquement à des fins légales et conformément aux lois en vigueur."
        )}
      </p>
      <p className={`text-sm ${T_MUTED}`}>
        {t("Vous vous engagez à ne pas nuire au fonctionnement de l'application.")}
      </p>

      <h2 className={`text-lg font-semibold ${T_PRIMARY}`}>
        {t("3. Propriété intellectuelle")}
      </h2>
      <p className={`text-sm ${T_MUTED}`}>
        {t(
          "Le contenu et les fonctionnalités de l'application sont protégés par des droits d'auteur. Vous ne pouvez pas les reproduire sans autorisation."
        )}
      </p>

      <h2 className={`text-lg font-semibold ${T_PRIMARY}`}>
        {t("4. Limitation de responsabilité")}
      </h2>
      <p className={`text-sm ${T_MUTED}`}>
        {t(
          "L'application est fournie en l'état et les développeurs ne peuvent être tenus responsables des dommages résultant de son utilisation."
        )}
      </p>

      <h2 className={`text-lg font-semibold ${T_PRIMARY}`}>
        {t("5. Modifications des conditions")}
      </h2>
      <p className={`text-sm ${T_MUTED}`}>
        {t(
          "Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications sont publiées sur cette page."
        )}
      </p>

      <h2 className={`text-lg font-semibold ${T_PRIMARY}`}>
        {t("6. Contact")}
      </h2>
      <p className={`text-sm ${T_MUTED}`}>
        {t(
          "Pour toute question concernant ces conditions, contactez-nous à l'adresse contact@example.com."
        )}
      </p>
    </motion.section>
  );
}
