import React, { useMemo, useEffect, useRef } from "react";
import { motion, animate } from "framer-motion";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import type { Zone } from "../types";
import { generateForecast } from "../utils";

interface Props {
  zone: Zone;
  onGo: () => void;
  onAdd: () => void;
  onOpenShroom: (id: string) => void;
  onClose: () => void;
}

export default function ZoneDashboard({ zone, onGo, onAdd, onOpenShroom, onClose }: Props) {
  const data = useMemo(() => generateForecast("fr"), [zone?.id]);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const path = chartRef.current?.querySelector(
      ".recharts-line-curve"
    ) as SVGPathElement | null;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    animate(path, { strokeDashoffset: 0 }, { duration: 1.2, ease: "easeInOut" });
  }, [data]);

  if (!zone) return null;

  return (
    <motion.section
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="fixed inset-0 z-50 p-3 bg-background/80 backdrop-blur-sm overflow-auto grid place-items-center"
    >
      <div className="rounded-2xl border bg-paper text-foreground overflow-hidden w-full max-w-xl">
        <div className="p-4 border-b flex items-center justify-between gap-2">
          <div className="text-base font-medium">{zone.name}</div>
          <span className="inline-flex items-center px-2 py-0.5 text-sm rounded-full border">
            {zone.score}%
          </span>
        </div>
        <div className="p-4">
          <div className="h-56" ref={chartRef}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: "hsl(var(--forest-green))" }}
                  interval={3}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "hsl(var(--forest-green))" }}
                  width={28}
                />
                <Tooltip />
                <ReferenceLine x={data[7].day} strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--fern-green))"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-xs">Icônes météo (démo)</div>
          <div className="mt-4">
            <div className="text-sm mb-2">Comestibles probables</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(zone.species)
                .filter(([, v]) => v > 0)
                .map(([id, sc]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onOpenShroom(id)}
                    className="rounded-xl border p-2 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-lg border overflow-hidden grid place-items-center text-xs">
                        img
                      </div>
                      <div>
                        <div className="text-sm font-medium">{labelFromId(id)}</div>
                        <div className="text-xs">Score {sc}%</div>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button type="button" onClick={onGo} className="rounded-xl border px-3 py-2">
              Y aller
            </button>
            <button type="button" onClick={onAdd} className="rounded-xl border px-3 py-2">
              Ajouter à mes coins
            </button>
            <button type="button" onClick={onClose} className="ml-auto rounded-xl border px-3 py-2">
              Fermer
            </button>
          </div>
          <p className="text-xs mt-2">
            Prévisions locales hors‑ligne (7 jours) disponibles pour 3 champignons inclus.
          </p>
        </div>
      </div>
    </motion.section>
  );
}

function labelFromId(id: string) {
  const dict: Record<string, string> = {
    cepe: "Cèpe",
    girolle: "Girolle",
    morille: "Morille",
  };
  return dict[id] || id;
}
