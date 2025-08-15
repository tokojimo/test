import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n";
import { useAppContext } from "@/context/AppContext";
import type { VisitHistory } from "@/types";
import LastHarvestCard from "@/components/history/LastHarvestCard";
import MapSpotCard from "@/components/history/MapSpotCard";
import HarvestList from "@/components/history/HarvestList";
import HarvestListSkeleton from "@/components/history/HarvestListSkeleton";
import ChartSkeleton from "@/components/history/ChartSkeleton";
import HarvestModal, { Harvest } from "@/components/harvest/HarvestModal";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatDate } from "@/utils/dates";


export default function History() {
  const { t } = useT();
  const { state, dispatch } = useAppContext();
  const spot = state.mySpots[0] || {
    id: 1,
    name: t("Mon coin"),
    location: "48.8566,2.3522",
    history: [] as VisitHistory[],
  };

  const [history, setHistory] = useState<VisitHistory[]>(spot.history);
  const [chartLoading, setChartLoading] = useState(true);
  const [listLoading] = useState(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setChartLoading(true);
    const timer = setTimeout(() => setChartLoading(false), 300);
    return () => clearTimeout(timer);
  }, [history]);

  const saveHarvest = (h: Harvest) => {
    const visit: VisitHistory = { date: h.date, rating: h.rating, note: h.comment, photos: h.photos };
    let newHistory: VisitHistory[];
    if (modalIndex !== null) {
      newHistory = history.map((v, idx) => (idx === modalIndex ? visit : v));
    } else {
      newHistory = [visit, ...history];
    }
    newHistory = newHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setHistory(newHistory);
    dispatch({ type: "updateSpot", spot: { ...spot, history: newHistory } });
  };

  const deleteHarvest = (idx: number) => {
    const newHistory = history.filter((_, i) => i !== idx);
    setHistory(newHistory);
    dispatch({ type: "updateSpot", spot: { ...spot, history: newHistory } });
  };

  const data = history.map((h) => ({ date: h.date, value: h.rating }));
  const ticks = data.length ? data.filter((_, i) => i % Math.ceil(data.length / 6) === 0).map((d) => d.date) : [];

  const location = spot.location
    ? spot.location.split(",").map((v) => parseFloat(v.trim()))
    : [48.8566, 2.3522];

  const current = modalIndex !== null ? history[modalIndex] : undefined;

  return (
    <section className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">{spot.name}</h1>
      <div style={{ height: 240 }}>
        {chartLoading ? (
          <ChartSkeleton />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                ticks={ticks}
                tickFormatter={(v) => formatDate(v).slice(0, 5)}
                stroke="hsl(var(--foreground))"
                tick={{ fill: "hsl(var(--foreground))" }}
              />
              <YAxis domain={[0, 5]} stroke="hsl(var(--foreground))" tick={{ fill: "hsl(var(--foreground))" }} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 4 }}
                labelFormatter={(v) => formatDate(v as string).slice(0, 5)}
              />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--forest-green))" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Button onClick={() => { setModalIndex(null); setModalOpen(true); }}>
            {t("Ajouter une cueillette")}
          </Button>
          <LastHarvestCard harvest={history[0]} />
        </div>
        <MapSpotCard center={[location[0], location[1]] as [number, number]} />
      </div>
      <div>
        {listLoading ? (
          <HarvestListSkeleton />
        ) : (
          <HarvestList
            items={history}
            onEdit={(i) => {
              setModalIndex(i);
              setModalOpen(true);
            }}
            onDelete={deleteHarvest}
          />
        )}
      </div>
      <HarvestModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setModalIndex(null);
        }}
        initial={current ? { ...current, comment: current.note } : undefined}
        onSave={saveHarvest}
        onDelete={current ? () => { deleteHarvest(modalIndex!); setModalOpen(false); setModalIndex(null); } : undefined}
      />
    </section>
  );
}

