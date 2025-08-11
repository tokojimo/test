import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BTN, BTN_GHOST_ICON, T_PRIMARY } from "../styles/tokens";
import { useAuth } from "../context/AuthContext";
import { useT } from "../i18n";

export default function LoginScene({
  onSignup,
  onBack,
  onPremium,
}: {
  onSignup: () => void;
  onBack: () => void;
  onPremium: () => void;
}) {
  const { login, loginWithProvider } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useT();

  const handleLogin = () => {
    if (login(username, password)) {
      onBack();
    } else {
      alert(t("Nom d'utilisateur ou mot de passe incorrect"));
    }
  };

  return (
    <motion.section
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center bg-background p-3"
    >
      <header className="flex items-center justify-between w-full max-w-sm mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className={BTN_GHOST_ICON}
          aria-label={t("Retour")}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button variant="ghost" onClick={onPremium} className="text-sm underline p-0">
          {t("Passer en premium")}
        </Button>
      </header>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className={`text-center ${T_PRIMARY}`}>{t("Se connecter")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
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
          <Button onClick={handleLogin} className={`${BTN} w-full`}>
            {t("Se connecter")}
          </Button>
          <Button
            onClick={() => {
              loginWithProvider("google");
              onBack();
            }}
            className={`${BTN} w-full`}
          >
            {t("Se connecter avec Google")}
          </Button>
          <Button
            onClick={() => {
              loginWithProvider("apple");
              onBack();
            }}
            className={`${BTN} w-full`}
          >
            {t("Se connecter avec Apple")}
          </Button>
          <button type="button" className="text-sm underline" onClick={() => {}}>
            {t("Mot de passe oublié ?")}
          </button>
          <p className="text-sm text-center">
            {t("Pas encore de compte ?")} {" "}
            <button type="button" onClick={onSignup} className="underline">
              {t("Créer un compte")}
            </button>
          </p>
        </CardContent>
      </Card>
    </motion.section>
  );
}
