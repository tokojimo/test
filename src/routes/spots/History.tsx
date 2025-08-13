import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import MapCard from "@/components/history/MapCard";
import InsightsCard from "@/components/history/InsightsCard";
import EditHarvestModal from "@/components/harvest/EditHarvestModal";
import { TimelineEvent } from "@/components/history/Timeline";
import useMediaQuery from "@/hooks/useMediaQuery";

export default function History() {
  const events: TimelineEvent[] = [
    { id: "1", date: "01/09/2024", rating: 3, label: "Création" },
    { id: "2", date: "10/09/2024", rating: 4, label: "Visite" },
  ];
  const [editing, setEditing] = useState<TimelineEvent | null>(null);
  const isMobile = useMediaQuery("(max-width: 1023px)");

  return (
    <section className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Historique du coin</h1>
        <Button onClick={() => setEditing({ id: "", date: "", rating: 0, label: "" })}>Ajouter une cueillette</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MapCard center={[48.8566, 2.3522]} />
        <InsightsCard events={events} onSelect={id => setEditing(events.find(e => e.id === id) || null)} />
      </div>
      {isMobile && (
        <div>
          <Button className="w-full" onClick={() => setEditing({ id: "", date: "", rating: 0, label: "" })}>
            Ajouter une cueillette
          </Button>
        </div>
      )}
      <EditHarvestModal
        open={editing !== null}
        initial={editing ? { date: editing.date, rating: editing.rating, comment: "", photos: [] } : undefined}
        onClose={() => setEditing(null)}
        onSave={() => setEditing(null)}
        onDelete={editing && editing.id ? () => setEditing(null) : undefined}
      />
    </section>
  );
}
