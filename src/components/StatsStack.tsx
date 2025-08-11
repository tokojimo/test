import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

type StatItem = {
  label: string;
  percent: string;
  down?: boolean;
};

const data: StatItem[] = [
  { label: "Ripisylve du Vieux Pont", percent: "72% ⬊", down: true },
  { label: "Cèpe", percent: "40%" },
  { label: "Girolle", percent: "55%" },
  { label: "Morille", percent: "85%" }
];

export function StatsStack() {
  const [items, setItems] = useState<StatItem[]>([]);
  const [index, setIndex] = useState(0);

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
              <Card data-testid="stat-card">
                <CardContent className="flex justify-between">
                  <span className="font-semibold">{item.label}</span>
                  <span className={item.down ? "text-danger" : ""}>{item.percent}</span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default StatsStack;
