import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BTN, BTN_GHOST_ICON, T_MUTED, T_SUBTLE } from "../styles/tokens";

export default function RouteScene({ onBackToMap, onBack }: { onBackToMap: () => void; onBack: () => void }) {
  return (
    <motion.section initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="p-3">
      <Button variant="ghost" size="icon" onClick={onBack} className={`${BTN_GHOST_ICON} mb-3`} aria-label="Retour">
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <div className="relative h-[60vh] rounded-2xl border border-neutral-800 overflow-hidden bg-neutral-900 grid">
        <div className={`p-3 text-sm ${T_MUTED}`}>Instructions étape par étape (démo) : <br/>🚗 Rejoindre parking → 🚶 Sentier balisé → 🧭 Boussole sur 250 m</div>
        <div className="absolute top-3 right-3 flex gap-2">
          <Button className={BTN}>Marquer véhicule</Button>
          <Button onClick={onBackToMap} className={BTN}>Retour carte</Button>
        </div>
      </div>
      <p className={`text-xs mt-2 ${T_SUBTLE}`}>Navigation piéton/boussole disponible hors‑ligne si la zone est téléchargée.</p>
    </motion.section>
  );
}
