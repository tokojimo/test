import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
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
import { formatDate } from "@/utils";
import { BTN_GHOST_ICON, T_PRIMARY } from "@/styles/tokens";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";


export default function History() {
  const { t } = useT();
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();
  const spot = state.mySpots[0] || {
    id: 1,
    name: t("Mon coin"),
    location: "48.8566,2.3522",
    history: [] as VisitHistory[],
  };

  const [history, setHistory] = useState<VisitHistory[]>(
    spot.history.map((h) => ({ id: h.id || crypto.randomUUID(), ...h }))
  );
  const [chartLoading, setChartLoading] = useState(true);
  const [listLoading] = useState(false);
  const [modalId, setModalId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setChartLoading(true);
    const timer = setTimeout(() => setChartLoading(false), 300);
    return () => clearTimeout(timer);
  }, [history]);

  const saveHarvest = (h: Harvest) => {
    const visit: VisitHistory = {
      id: modalId || crypto.randomUUID(),
      date: h.date,
      rating: h.rating,
      note: h.comment,
      photos: h.photos,
    };
    let newHistory: VisitHistory[];
    if (modalId !== null) {
      newHistory = history.map((v) => (v.id === modalId ? visit : v));
    } else {
      newHistory = [visit, ...history];
    }
    newHistory = newHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setHistory(newHistory);
    dispatch({ type: "updateSpot", spot: { ...spot, history: newHistory } });
  };

  const deleteHarvest = (id: string) => {
    const newHistory = history.filter((v) => v.id !== id);
    setHistory(newHistory);
    dispatch({ type: "updateSpot", spot: { ...spot, history: newHistory } });
  };

  const data = history.map((h) => ({ date: h.date, value: h.rating }));
  const ticks = data.length ? data.filter((_, i) => i % Math.ceil(data.length / 6) === 0).map((d) => d.date) : [];

  const location = spot.location
    ? spot.location.split(",").map((v) => parseFloat(v.trim()))
    : [48.8566, 2.3522];

  const current = modalId !== null ? history.find((h) => h.id === modalId) : undefined;

  return (
    <section className="p-3 space-y-3">
      <div className="relative h-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className={`absolute left-0 ${BTN_GHOST_ICON}`}
          aria-label={t("Retour")}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h2 className={`absolute inset-0 grid place-items-center text-lg font-semibold pointer-events-none ${T_PRIMARY}`}>
          {spot.name}
        </h2>
      </div>
      <div style={{ height: 240 }}>
        {chartLoading ? (
          <ChartSkeleton />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
              <XAxis dataKey="date" ticks={ticks} tickFormatter={formatDate} stroke="hsl(var(--foreground))" tick={{ fill: "hsl(var(--foreground))" }} />
              <YAxis domain={[0, 5]} stroke="hsl(var(--foreground))" tick={{ fill: "hsl(var(--foreground))" }} />
              <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 4 }} labelFormatter={(v) => formatDate(v as string)} />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--forest-green))" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="space-y-3">
          <Button onClick={() => { setModalId(null); setModalOpen(true); }}>
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
            onEdit={(id) => {
              setModalId(id);
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
          setModalId(null);
        }}
        initial={current ? { ...current, comment: current.note } : undefined}
        onSave={saveHarvest}
        onDelete={current ? () => { deleteHarvest(modalId!); setModalOpen(false); setModalId(null); } : undefined}
      />
    </section>
  );
}

