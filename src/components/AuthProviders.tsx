import React from "react";
import { Button } from "@/components/ui/button";
import { BTN } from "../styles/tokens";
import { useT } from "../i18n";

interface AuthProvidersProps {
  onProvider: (provider: "google" | "apple") => void;
  mode: "login" | "signup";
}

export function AuthProviders({ onProvider, mode }: AuthProvidersProps) {
  const { t } = useT();

  const labels = {
    login: {
      google: t("Se connecter avec Google"),
      apple: t("Se connecter avec Apple"),
    },
    signup: {
      google: t("Créer un compte avec Google"),
      apple: t("Créer un compte avec Apple"),
    },
  } as const;

  return (
    <div className="space-y-2">
      <Button onClick={() => onProvider("google")} className={BTN}>
        {labels[mode].google}
      </Button>
      <Button onClick={() => onProvider("apple")} className={BTN}>
        {labels[mode].apple}
      </Button>
    </div>
  );
}

export default AuthProviders;
