import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Route, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import { BTN, BTN_GHOST_ICON, T_PRIMARY, T_MUTED, T_SUBTLE } from "../styles/tokens";
import { MUSHROOMS } from "../data/mushrooms";
import { generateForecast } from "../utils";

export default function ZoneScene({ zone, onGo, onAdd, onOpenShroom, onBack }: { zone: any; onGo: () => void; onAdd: () => void; onOpenShroom: (id: string) => void; onBack: () => void }) {
  const data = useMemo(() => generateForecast(), [zone?.id]);
  if (!zone) return <div className={`p-6 ${T_PRIMARY}`}>Sélectionnez une zone…</div>;
  return (
    <motion.section initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="p-3">
      <Button variant="ghost" size="icon" onClick={onBack} className={`${BTN_GHOST_ICON} mb-3`} aria-label="Retour">
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Card className="bg-neutral-900 border-neutral-800 rounded-2xl">
        <CardHeader>
          <CardTitle className={`flex items-center justify-between ${T_PRIMARY}`}>
            <div>
              <div>{zone.name}</div>
              <div className={`text-xs ${T_MUTED}`}>{zone.coords?.join(", ")}</div>
            </div>
            <Badge>{zone.score}%</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#d4d4d4" }} interval={3} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#d4d4d4" }} width={28} />
                <Tooltip contentStyle={{ background: "#171717", border: "1px solid #262626", borderRadius: 12, color: "#e5e5e5" }} />
                <ReferenceLine x={data[7].day} stroke="#525252" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="score" stroke="#e5e5e5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className={`mt-2 text-xs ${T_SUBTLE}`}>Icônes météo (démo)</div>

          <div className="mt-4">
            <div className={`text-sm mb-2 ${T_PRIMARY}`}>Comestibles probables</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(zone.species).filter(([_, v]) => v > 0).map(([id, sc]) => {
                const m = MUSHROOMS.find(m => m.id === id);
                return (
                  <button key={id} onClick={() => onOpenShroom(id)} className={`bg-neutral-800 border border-neutral-700 rounded-xl p-2 hover:bg-neutral-700 ${T_PRIMARY}`}>
                    <div className="flex items-center gap-2">
                      <img src={m.photo} className="w-12 h-12 object-cover rounded-lg" />
                      <div>
                        <div className={`text-sm font-medium ${T_PRIMARY}`}>{m.name}</div>
                        <div className={`text-xs ${T_MUTED}`}>Score {sc}%</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Button onClick={onGo} className={BTN}><Route className="w-4 h-4 mr-2" />Y aller</Button>
            <Button onClick={onAdd} className={BTN}><Plus className="w-4 h-4 mr-2" />Ajouter à mes coins</Button>
          </div>
          <p className={`text-xs mt-2 ${T_SUBTLE}`}>Prévisions locales hors‑ligne (7 jours) disponibles pour 3 champignons inclus.</p>
        </CardContent>
      </Card>
    </motion.section>
  );
}
