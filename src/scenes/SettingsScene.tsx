import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BTN, BTN_GHOST_ICON, T_PRIMARY, T_MUTED } from "../styles/tokens";
import { ToggleRow } from "../components/ToggleRow";
import { SelectRow } from "../components/SelectRow";

export default function SettingsScene({ alerts, setAlerts, prefs, setPrefs, onOpenPacks, onBack }: { alerts: any; setAlerts: (v: any) => void; prefs: any; setPrefs: (v: any) => void; onOpenPacks: () => void; onBack: () => void }) {
  return (
    <motion.section initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="p-3 space-y-3">
      <Button variant="ghost" size="icon" onClick={onBack} className={BTN_GHOST_ICON} aria-label="Retour">
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Card className="bg-neutral-900 border-neutral-800 rounded-2xl">
        <CardHeader><CardTitle className={T_PRIMARY}>Cartes hors‑ligne</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className={`font-medium ${T_PRIMARY}`}>Pack initial (50 km)</div>
              <div className={`text-xs ${T_MUTED}`}>Topo + Cèpe/Girolle/Morille</div>
            </div>
            <Button onClick={onOpenPacks} className={BTN}><Download className="w-4 h-4 mr-2" />Télécharger une zone</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-800 rounded-2xl">
        <CardHeader><CardTitle className={T_PRIMARY}>Alertes</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <ToggleRow label="Optimum prévu" checked={alerts.optimum} onChange={(v) => setAlerts((a: any) => ({ ...a, optimum: v }))} />
          <ToggleRow label="Nouvelle zone proche" checked={alerts.newZone} onChange={(v) => setAlerts((a: any) => ({ ...a, newZone: v }))} />
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-800 rounded-2xl">
        <CardHeader><CardTitle className={T_PRIMARY}>Préférences</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <SelectRow label="Unités" value={prefs.units} options={["métriques", "impériales"]} onChange={(v) => setPrefs((p: any) => ({ ...p, units: v }))} />
          <SelectRow label="Thème" value={prefs.theme} options={["auto", "clair", "sombre"]} onChange={(v) => setPrefs((p: any) => ({ ...p, theme: v }))} />
          <ToggleRow label="GPS" checked={prefs.gps} onChange={(v) => setPrefs((p: any) => ({ ...p, gps: v }))} />
        </CardContent>
      </Card>

      <div className={`text-sm ${T_MUTED}`}>« À propos » • « Conseils de cueillette »</div>
    </motion.section>
  );
}
