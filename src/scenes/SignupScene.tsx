import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BTN, BTN_GHOST_ICON, T_PRIMARY } from "../styles/tokens";
import { useAuth } from "../context/AuthContext";
import { useT } from "../i18n";
import { useNavigate } from "react-router-dom";
import { Scene } from "../routes";
import AuthProviders from "../components/AuthProviders";

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
      className="min-h-screen flex items-center justify-center p-3"
    >
      <div className="w-full max-w-md space-y-4 p-6 rounded-xl bg-background/60 backdrop-blur-md shadow-lg">
        <header className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className={BTN_GHOST_ICON}
            aria-label={t("Retour")}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </header>
        <div className="space-y-4">
          <div className={`text-lg font-medium text-center ${T_PRIMARY}`}>{t("Créer un compte")}</div>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleSignup();
            }}
          >
            <div className="space-y-1">
              <label htmlFor="username" className="text-sm font-medium">
                {t("Nom d'utilisateur")}
              </label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium">
                {t("Mot de passe")}
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className={BTN}>
              {t("Créer un compte")}
            </Button>
          </form>
          <div className="pt-2 border-t">
            <AuthProviders mode="signup" onProvider={handleProviderSignup} />
          </div>
          <Button onClick={onLogin} className={BTN} variant="ghost">
            {t("Se connecter")}
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
