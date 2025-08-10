import React from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MushroomIcon } from "../components/MushroomIcon";
import { BTN, BTN_GHOST_ICON, T_PRIMARY, T_MUTED } from "../styles/tokens";

export default function LandingScene({ onSeeMap, onMySpots, onOpenSettings, onOpenPicker }: { onSeeMap: () => void; onMySpots: () => void; onOpenSettings: () => void; onOpenPicker: () => void }) {
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative min-h-[calc(100vh-0px)]">
      <div className="absolute top-3 right-3 z-20">
        <Button variant="ghost" size="icon" onClick={onOpenSettings} className={BTN_GHOST_ICON} aria-label="Réglages">
          <Menu className="w-7 h-7" />
        </Button>
      </div>

      <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1920&auto=format&fit=crop" alt="forêt brumeuse" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="mx-auto mb-6 w-20 h-20 rounded-2xl bg-neutral-800/60 border border-neutral-700 grid place-items-center shadow-xl">
          <MushroomIcon className={T_PRIMARY} />
        </div>
        <h1 className={`text-3xl font-semibold ${T_PRIMARY}`}>Trouvez vos coins à champignons comestibles, même sans réseau.</h1>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={onSeeMap} className={BTN}>Voir la carte</Button>
          <Button onClick={onMySpots} className={BTN}>Mes coins</Button>
          <Button onClick={onOpenPicker} className={BTN}>Les champignons</Button>
        </div>
        <p className={`mt-8 text-sm ${T_MUTED}`}>Mini‑pack offline inclus : carte topo (50 km) + fiches Cèpe, Girolle, Morille.</p>
      </div>
    </motion.section>
  );
}
