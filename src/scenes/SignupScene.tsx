import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BTN, BTN_GHOST_ICON, T_PRIMARY } from "../styles/tokens";
import { useAuth } from "../context/AuthContext";
import { useT } from "../i18n";

export default function SignupScene({ onLogin, onBack }: { onLogin: () => void; onBack: () => void }) {
  const { signup } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useT();

  const handleSignup = () => {
    if (signup(username, password)) {
      onBack();
    } else {
      alert(t("Nom d'utilisateur déjà pris"));
    }
  };

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
      <div className="space-y-3">
        <div className={`text-lg font-medium ${T_PRIMARY}`}>{t("Créer un compte")}</div>
        <Input
          placeholder={t("Nom d'utilisateur")}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder={t("Mot de passe")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleSignup} className={BTN}>
          {t("Créer un compte")}
        </Button>
        <Button onClick={onLogin} className={BTN} variant="ghost">
          {t("Se connecter")}
        </Button>
      </div>
    </motion.section>
  );
}
