import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import ZoneDashboard from "./ZoneDashboard";
import type { Zone } from "../types";

type StatItem = Zone;

const data: StatItem[] = [
  {
    id: "la_vrignaie",
    name: "La Vrignaie",
    score: 72,
    species: { cepe: 40, girolle: 55, morille: 85 },
    trend: "down",
    coords: [0, 0]
  },
  {
    id: "bois_joli",
    name: "Bois Joli",
    score: 60,
    species: { cepe: 30, girolle: 50, morille: 40 },
    trend: "up",
    coords: [0, 0]
  },
  {
    id: "ripisylve",
    name: "Ripisylve du Vieux Pont",
    score: 68,
    species: { cepe: 35, girolle: 60, morille: 80 },
    trend: "down",
    coords: [0, 0]
  },
  {
    id: "foret_pins",
    name: "Forêt des Pins",
    score: 80,
    species: { cepe: 70, girolle: 40, morille: 20 },
    trend: "up",
    coords: [0, 0]
  }
];

export function StatsStack() {
  const [items, setItems] = useState<StatItem[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<StatItem | null>(null);

  const addItem = () => {
    setItems(prev => {
      const next = [...prev, data[index % data.length]];
      return next.slice(-3);
    });
    setIndex(i => i + 1);
  };

  return (
    <div className="min-h-40">
      <Button onClick={addItem}>Ajouter une carte</Button>
      <div className="fixed bottom-4 left-4 flex flex-col gap-2">
        <AnimatePresence>
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
            >
              <Card data-testid="stat-card" onClick={() => setSelected(item)} className="cursor-pointer">
                <CardContent className="flex justify-between">
                  <span className="font-semibold">{item.name}</span>
                  <span className={item.trend === "down" ? "text-danger" : ""}>
                    {item.score}% {item.trend === "down" ? "⬊" : ""}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {selected && (
        <ZoneDashboard
          zone={selected}
          onGo={() => {}}
          onAdd={() => {}}
          onOpenShroom={() => {}}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

export default StatsStack;
