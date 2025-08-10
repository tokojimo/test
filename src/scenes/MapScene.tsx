import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, LocateFixed, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MUSHROOMS, DEMO_ZONES, LEGEND } from "../data";
import { classNames } from "../utils";
import { BTN, BTN_GHOST_ICON, T_PRIMARY, T_MUTED, T_SUBTLE } from "../styles/tokens";

export default function MapScene({ onZone, onOpenShroom, gpsFollow, setGpsFollow, onBack }: { onZone: (z: any) => void; onOpenShroom: (id: string) => void; gpsFollow: boolean; setGpsFollow: (v: (p: boolean) => boolean | boolean) => void; onBack: () => void }) {
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const zones = useMemo(() => (selectedSpecies.length === 0 ? DEMO_ZONES : DEMO_ZONES.filter(z => selectedSpecies.every(id => (z.species[id] || 0) > 50))), [selectedSpecies]);

  return (
    <motion.section initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="p-3">
      <div className="flex items-center gap-2 mb-3">
        <Button variant="ghost" size="icon" onClick={onBack} className={BTN_GHOST_ICON} aria-label="Retour">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="relative flex-1">
          <Input placeholder="Rechercher un lieu…" className={`pl-9 bg-neutral-900 border-neutral-800 ${T_PRIMARY}`} />
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${T_MUTED}`} />
        </div>
        <Button onClick={() => setGpsFollow(v => !v)} className={BTN}><LocateFixed className="w-4 h-4 mr-2" />GPS</Button>
      </div>

      <div className="relative h-[60vh] rounded-2xl border border-neutral-800 overflow-hidden">
        <iframe title="Carte" className="absolute inset-0 w-full h-full" src="https://www.openstreetmap.org/export/embed.html"></iframe>

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Button variant="ghost" size="icon" onClick={() => setGpsFollow(true)} className={BTN_GHOST_ICON} aria-label="Ma position">📍</Button>
          <div className="bg-neutral-900/80 backdrop-blur rounded-xl p-2 border border-neutral-800 flex items-center gap-2">
            <span className={`text-xs ${T_PRIMARY}`}>Légende</span>
            {LEGEND.map((l, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className={classNames("w-3 h-3 rounded", l.color)} />
                <span className={`text-[10px] ${T_MUTED}`}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-3 left-3 grid gap-2">
          {zones.map(z => (
            <div key={z.id} onClick={() => onZone(z)} role="button" tabIndex={0} className="bg-neutral-900/80 hover:bg-neutral-800/80 border border-neutral-800 rounded-xl px-3 py-2 text-left cursor-pointer">
              <div className="flex items-center justify-between">
                <div className={`font-medium ${T_PRIMARY}`}>{z.name}</div>
                <Badge variant={z.score > 85 ? "default" : "secondary"}>{z.score}%</Badge>
              </div>
              <div className={`text-xs ${T_MUTED}`}>{z.trend}</div>
              <div className="mt-1 flex gap-1">
                {Object.entries(z.species).map(([id, sc]) => (
                  <span key={id} onClick={(e) => { e.stopPropagation(); onOpenShroom(id); }} className={`text-[10px] bg-neutral-800 border border-neutral-700 px-2 py-1 rounded-full hover:bg-neutral-700 ${T_PRIMARY} cursor-pointer`}>{MUSHROOMS.find(m => m.id === id)?.name.split(" ")[0]} {sc}%</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {MUSHROOMS.map(m => {
          const active = selectedSpecies.includes(m.id);
          return (
            <Button key={m.id} onClick={() => setSelectedSpecies(s => active ? s.filter(x => x !== m.id) : [...s, m.id])} className={classNames(BTN, active ? "" : "opacity-60")}>{m.name}</Button>
          );
        })}
      </div>

      <p className={`text-xs mt-2 ${T_SUBTLE}`}>Hors ligne : affichage des zones optimales Cèpe, Girolle, Morille.</p>
    </motion.section>
  );
}
