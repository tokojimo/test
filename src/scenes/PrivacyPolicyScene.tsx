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

      <h2 className={`text-lg font-semibold ${T_PRIMARY}`}>
        {t("1. Collecte des informations")}
      </h2>
      <p className={`text-sm ${T_MUTED}`}>
        {t(
          "Nous collectons uniquement les informations que vous nous fournissez volontairement via l'application."
        )}
      </p>

      <h2 className={`text-lg font-semibold ${T_PRIMARY}`}>
        {t("2. Utilisation des informations")}
      </h2>
      <p className={`text-sm ${T_MUTED}`}>
        {t(
          "Les informations sont utilisées pour fournir et améliorer le service et ne sont pas utilisées à d'autres fins."
        )}
      </p>

      <h2 className={`text-lg font-semibold ${T_PRIMARY}`}>
        {t("3. Partage des informations")}
      </h2>
      <p className={`text-sm ${T_MUTED}`}>
        {t(
          "Nous ne vendons ni ne partageons vos informations personnelles avec des tiers, sauf si la loi l'exige."
        )}
      </p>

      <h2 className={`text-lg font-semibold ${T_PRIMARY}`}>
        {t("4. Conservation des données")}
      </h2>
      <p className={`text-sm ${T_MUTED}`}>
        {t(
          "Les informations sont conservées uniquement pendant la durée nécessaire pour atteindre l'objectif décrit."
        )}
      </p>

      <h2 className={`text-lg font-semibold ${T_PRIMARY}`}>
        {t("5. Droits des utilisateurs")}
      </h2>
      <p className={`text-sm ${T_MUTED}`}>
        {t(
          "Vous pouvez demander l'accès, la rectification ou la suppression de vos informations personnelles en nous contactant."
        )}
      </p>

      <h2 className={`text-lg font-semibold ${T_PRIMARY}`}>
        {t("6. Sécurité")}
      </h2>
      <p className={`text-sm ${T_MUTED}`}>
        {t(
          "Nous mettons en place des mesures raisonnables pour protéger vos informations contre tout accès non autorisé."
        )}
      </p>

      <h2 className={`text-lg font-semibold ${T_PRIMARY}`}>
        {t("7. Modifications de la politique")}
      </h2>
      <p className={`text-sm ${T_MUTED}`}>
        {t(
          "Nous pouvons mettre à jour cette politique de confidentialité. Les modifications sont publiées sur cette page."
        )}
      </p>

      <h2 className={`text-lg font-semibold ${T_PRIMARY}`}>
        {t("8. Contact")}
      </h2>
      <p className={`text-sm ${T_MUTED}`}>
        {t(
          "Pour toute question concernant cette politique, contactez-nous à l'adresse contact@example.com."
        )}
      </p>
    </motion.section>
  );
}
