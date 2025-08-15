import React, { useState } from "react";
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
import HarvestModal, { Harvest } from "@/components/harvest/HarvestModal";
import { BTN_GHOST_ICON, T_PRIMARY } from "@/styles/tokens";
import { MUSHROOMS } from "@/data/mushrooms";
import ForecastChart from "@/components/ForecastChart";


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
  const [listLoading] = useState(false);
  const [modalId, setModalId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const saveHarvest = (h: Harvest) => {
    const note = h.species
      .map((id) => MUSHROOMS.find((m) => m.id === id)?.name.split(" ")[0])
      .filter(Boolean)
      .join(", ");
    const visit: VisitHistory = {
      id: modalId || crypto.randomUUID(),
      date: h.date,
      rating: h.rating,
      note,
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
    dispatch({
      type: "updateSpot",
      spot: { ...spot, history: newHistory, last: newHistory[0]?.date },
    });
  };

  const deleteHarvest = (id: string) => {
    const newHistory = history.filter((v) => v.id !== id);
    setHistory(newHistory);
    dispatch({ type: "updateSpot", spot: { ...spot, history: newHistory } });
  };

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
      <ForecastChart />
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
        initial={
          current
            ? { id: current.id, date: current.date, rating: current.rating, species: [], photos: current.photos }
            : undefined
        }
        onSave={saveHarvest}
        onDelete={current ? () => { deleteHarvest(modalId!); setModalOpen(false); setModalId(null); } : undefined}
      />
    </section>
  );
}

