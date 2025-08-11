import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BTN, BTN_GHOST_ICON, T_PRIMARY } from "../styles/tokens";
import { useAuth } from "../context/AuthContext";
import { useT } from "../i18n";

export default function PremiumScene({ onBack }: { onBack: () => void }) {
  const { user, upgrade } = useAuth();
  const { t } = useT();
  return (
    <motion.section
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="p-3 space-y-4"
    >
      <Button variant="ghost" size="icon" onClick={onBack} className={BTN_GHOST_ICON} aria-label={t("Retour")}>
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <div className={`text-lg font-medium ${T_PRIMARY}`}>
        {user?.premium ? t("Vous êtes premium") : t("Passez en premium pour plus de fonctionnalités")}
      </div>
      {!user?.premium && (
        <Button
          onClick={() => {
            upgrade();
            onBack();
          }}
          className={`${BTN} bg-gold text-foreground hover:bg-gold/90`}
        >
          {t("Passer en premium")}
        </Button>
      )}
    </motion.section>
  );
}
