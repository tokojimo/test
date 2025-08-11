import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BTN, BTN_GHOST_ICON, T_PRIMARY } from "../styles/tokens";
import { useAuth } from "../context/AuthContext";
import { useT } from "../i18n";
import { useNavigate } from "react-router-dom";
import { Scene } from "../routes";

export default function SignupScene({ onLogin, onBack }: { onLogin: () => void; onBack: () => void }) {
  const { signup, loginWithProvider } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useT();
  const navigate = useNavigate();

  const handleSignup = () => {
    if (signup(username, password)) {
      if (localStorage.getItem("goPremiumAfterSignup") === "true") {
        localStorage.removeItem("goPremiumAfterSignup");
        navigate(Scene.Premium);
      } else {
        onBack();
      }
    } else {
      alert(t("Nom d'utilisateur déjà pris"));
    }
  };

  const handleProviderSignup = (provider: "google" | "apple") => {
    loginWithProvider(provider);
    if (localStorage.getItem("goPremiumAfterSignup") === "true") {
      localStorage.removeItem("goPremiumAfterSignup");
      navigate(Scene.Premium);
    } else {
      onBack();
    }
  };

  return (
    <motion.section
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center bg-background p-3"
    >
      <div className="w-full max-w-sm mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className={BTN_GHOST_ICON}
          aria-label={t("Retour")}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className={`text-center ${T_PRIMARY}`}>{t("Créer un compte")}</CardTitle>
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
          <Button onClick={handleSignup} className={`${BTN} w-full`}>
            {t("Créer un compte")}
          </Button>
          <Button onClick={() => handleProviderSignup("google")} className={`${BTN} w-full`}>
            {t("Créer un compte avec Google")}
          </Button>
          <Button onClick={() => handleProviderSignup("apple")} className={`${BTN} w-full`}>
            {t("Créer un compte avec Apple")}
          </Button>
          <Button onClick={onLogin} className={`${BTN} w-full`} variant="ghost">
            {t("Se connecter")}
          </Button>
        </CardContent>
      </Card>
    </motion.section>
  );
}
