import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  ChevronLeft,
  CloudRain,
  Compass,
  Expand,
  Leaf,
  Lock,
  MapPin,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts";
import { MUSHROOMS } from "../data/mushrooms";
import { generateForecast } from "../utils";
import { useT } from "../i18n";
import { useAppContext } from "../context/AppContext";
import { getStaticMapUrl } from "../services/openstreetmap";
import Logo from "@/assets/logo.png";
import type { Zone } from "../types";

export default function ZoneScene({
  zone,
  onAdd,
  onOpenShroom: _onOpenShroom,
  onBack,
  onOpenMap,
}: {
  zone: Zone | null;
  onAdd: () => void;
  onOpenShroom: (id: string) => void;
  onBack: () => void;
  onOpenMap: (zone: Zone) => void;
}) {
  const { t } = useT();
  const { state } = useAppContext();
  const data = useMemo(() => generateForecast(state.prefs.lang), [zone?.id, state.prefs.lang]);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string | null>(null);

  if (!zone) {
    return <div className="p-6 text-slate-900">{t("Sélectionnez une zone…")}</div>;
  }

  const speciesScores = Object.entries(zone.species as Record<string, number>)
    .filter(([, score]) => score > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([id, score]) => ({ mushroom: MUSHROOMS.find((m) => m.id === id), score }))
    .filter((entry) => entry.mushroom);
  const visibleSpecies = speciesScores.slice(0, 3);
  const selectedSpecies =
    speciesScores.find(({ mushroom }) => mushroom!.id === selectedSpeciesId) ?? speciesScores[0];
  const mushroom = selectedSpecies?.mushroom ?? MUSHROOMS[0];
  const baseScore = selectedSpecies?.score ?? zone.score;
  const adjustedScore = Math.min(99, baseScore + 7);
  const lockedData = data.slice(0, 10).map((point, index) => ({
    ...point,
    score: Math.max(10, Math.min(96, baseScore - 8 + index * 2 + (index % 3) * 3)),
  }));
  const [lat, lng] = zone.coords;
  const staticMapUrl = getStaticMapUrl(lat, lng, 520, 190, 14);

  const openDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  return (
    <motion.section
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="min-h-screen bg-[#fbf8f1] px-4 py-7 text-[#003f2a] sm:px-8"
    >
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <header className="relative pb-2 text-center">
          <button onClick={onBack} aria-label={t("Retour")} className="absolute left-0 top-1 rounded-full p-2 text-[#003f2a] transition hover:bg-emerald-50">
            <ChevronLeft className="h-8 w-8 stroke-[2.5]" />
          </button>
          <h1 className="font-serif text-5xl font-black leading-none tracking-tight sm:text-7xl">{zone.name}</h1>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold">Choisir un champignon</h2>
          <div className="flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {visibleSpecies.map(({ mushroom: species }) => {
              const active = species!.id === mushroom.id;
              return (
                <button
                  key={species!.id}
                  onClick={() => setSelectedSpeciesId(species!.id)}
                  className={`flex shrink-0 items-center gap-3 rounded-[1.45rem] border bg-white px-7 py-4 text-xl shadow-[0_12px_28px_-20px_rgba(15,23,42,0.65)] transition ${active ? "border-[#003f2a] font-extrabold ring-1 ring-[#003f2a]" : "border-[#eee6da] hover:border-[#9eb6a8]"}`}
                >
                  <img src={species!.photo} alt="" className="h-9 w-9 rounded-full object-cover" />
                  {species!.name}
                </button>
              );
            })}
            {speciesScores.length > 3 && (
              <button className="shrink-0 rounded-[1.45rem] border border-[#eee6da] bg-white px-8 py-4 text-xl shadow-[0_12px_28px_-20px_rgba(15,23,42,0.65)]">+{speciesScores.length - 3}</button>
            )}
          </div>
        </section>

        <section className="grid gap-7 rounded-[1.75rem] bg-white p-5 shadow-[0_22px_70px_-46px_rgba(15,23,42,0.75)] md:grid-cols-[0.95fr_1.05fr]">
          <img src={mushroom.photo} alt={mushroom.name} className="h-full min-h-[420px] w-full rounded-[1.35rem] object-cover" />
          <div className="space-y-5 py-3">
            <div>
              <h2 className="font-serif text-5xl font-black leading-tight">{mushroom.name}</h2>
              <p className="text-2xl italic text-[#6e7177]">{mushroom.latin}</p>
            </div>

            <div className="rounded-3xl border-2 border-[#00472d] p-7">
              <div className="flex items-center justify-between gap-3"><h3 className="text-2xl font-extrabold">Score de base</h3><span className="rounded-full bg-[#e8eee0] px-4 py-2 font-bold">Gratuit</span></div>
              <div className="mt-4 text-8xl font-black leading-none">{baseScore}<span className="text-5xl">%</span></div>
              <p className="mt-4 flex items-center gap-3 text-2xl"><Leaf className="h-7 w-7" /> Conditions naturelles</p>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-[#f0eee8] p-7">
              <div className="absolute right-5 top-5 z-10 flex items-center gap-2 rounded-full bg-white/55 px-4 py-2 font-bold"><Lock className="h-5 w-5" /> Premium</div>
              <div className="blur-[7px]">
                <h3 className="text-2xl font-extrabold">Score ajusté météo</h3>
                <div className="mt-5 flex items-center justify-between"><span className="text-8xl font-black">{adjustedScore}%</span><div className="h-32 w-32 rounded-full border-[14px] border-[#7fb28e]" /></div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-10 text-center"><Lock className="h-10 w-10 rounded-full bg-[#00472d] p-2 text-white" /><p className="text-2xl font-extrabold">Premium</p><p>Débloquez avec Premium</p></div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <InfoCard title="Carte" icon={<MapPin className="h-8 w-8" />} action={<Expand className="h-6 w-6" />} onClick={() => onOpenMap(zone)}>
            <div className="relative h-40 overflow-hidden rounded-2xl bg-[#eef1ea]"><img src={staticMapUrl} alt="" className="h-full w-full object-cover opacity-75" /><img src={Logo} alt="" className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2" /></div>
          </InfoCard>
          <InfoCard title="Météo" icon={<CloudRain className="h-9 w-9" />}>
            <div className="grid gap-3 text-xl"><p className="text-6xl font-black">18°C</p><p className="flex items-center gap-3"><CloudRain className="h-6 w-6" /> Pluie</p><p className="flex items-center gap-3"><Sprout className="h-6 w-6" /> Humidité 82%</p></div>
          </InfoCard>
        </section>

        <section className="relative overflow-hidden rounded-[1.5rem] bg-white p-6 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.75)]">
          <div className="mb-2 flex items-center justify-between"><h2 className="text-2xl font-extrabold">Évolution sur 10 jours</h2><span className="flex items-center gap-2 rounded-full bg-[#eeeae2] px-4 py-2 font-bold"><Lock className="h-5 w-5" /> Premium</span></div>
          <div className="h-44 blur-[6px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={lockedData}><Area type="monotone" dataKey="score" stroke="#2e7d32" strokeWidth={4} fill="#e7f1df" /></AreaChart></ResponsiveContainer></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-10"><Lock className="h-10 w-10 rounded-full bg-[#00472d] p-2 text-white" /><p className="text-2xl font-extrabold">Premium</p><p>Débloquez avec Premium</p></div>
        </section>

        <div className="flex items-center gap-5 rounded-[1.5rem] bg-white px-7 py-5 shadow-sm"><ShieldCheck className="h-14 w-14 shrink-0 fill-[#1e7c3e] text-[#1e7c3e]" /><div><p className="text-2xl font-extrabold">Rappel sécurité</p><p className="text-lg text-[#536078]">Ne consommez jamais un champignon sans identification certaine.</p></div></div>

        <footer className="grid gap-4 sm:grid-cols-2">
          <button onClick={openDirections} className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#00472d] px-6 py-5 text-xl font-extrabold text-white shadow-sm"><Compass className="h-8 w-8" /> Me guider</button>
          <button onClick={onAdd} className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#00472d] px-6 py-5 text-xl font-extrabold text-white shadow-sm"><Bookmark className="h-8 w-8" /> Ajouter à mes coins</button>
          <p className="text-center text-sm text-[#7a818b] sm:col-span-2">Source météo : Météo-France · Mise à jour le 12/07 à 08:00</p>
        </footer>
      </div>
    </motion.section>
  );
}

function InfoCard({ title, icon, action, onClick, children }: { title: string; icon: React.ReactNode; action?: React.ReactNode; onClick?: () => void; children: React.ReactNode }) {
  return (
    <section className="rounded-[1.5rem] bg-white p-5 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.75)]">
      <div className="mb-4 flex items-center justify-between text-[#003f2a]"><h2 className="flex items-center gap-4 text-2xl font-extrabold">{icon}{title}</h2>{action && <button onClick={onClick} className="rounded-full p-2 hover:bg-emerald-50">{action}</button>}</div>
      {children}
    </section>
  );
}
