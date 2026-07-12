import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Car,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  Droplets,
  Heart,
  Leaf,
  MapPin,
  Mountain,
  Navigation,
  ShieldCheck,
  Wind,
} from "lucide-react";
import { MUSHROOMS } from "../data/mushrooms";
import type { Zone } from "../types";

const forecast = [64, 55, 47, 58, 61, 76, 75, 82, 91, 91, 86];
const labels = ["J-5", "J-4", "J-3", "J-2", "J-1", "Aujourd'hui", "J+1", "J+2", "J+3", "J+4", "J+5"];

function trendLabel(trend: string) {
  const lower = trend.toLowerCase();
  if (lower.includes("stable") || trend.includes("→")) return "Score stable";
  if (lower.includes("hausse") || lower.includes("amélioration") || trend.includes("⬈")) return "Score en hausse";
  if (lower.includes("baisse") || trend.includes("⬊")) return "Score en baisse";
  return "Score stable";
}

function potentialLabel(score: number) {
  if (score >= 75) return { label: "élevé", className: "bg-[#e7f1df] text-[#0b4f33]" };
  if (score >= 50) return { label: "moyen", className: "bg-[#fff2ce] text-[#9a5a00]" };
  return { label: "faible", className: "bg-[#ffe8d7] text-[#ed4d1a]" };
}

function WeatherIcon() {
  return (
    <div className="relative h-28 w-36">
      <CloudSun className="absolute left-2 top-0 h-24 w-24 text-[#f7b827] drop-shadow-sm" strokeWidth={1.5} />
      <div className="absolute bottom-2 left-6 h-14 w-24 rounded-full bg-gradient-to-b from-slate-100 to-slate-300 shadow-lg" />
      <div className="absolute bottom-7 left-2 h-12 w-12 rounded-full bg-gradient-to-b from-white to-slate-200 shadow-md" />
      <div className="absolute bottom-6 left-14 h-16 w-16 rounded-full bg-gradient-to-b from-white to-slate-200 shadow-md" />
      <div className="absolute bottom-5 left-24 h-12 w-12 rounded-full bg-gradient-to-b from-white to-slate-200 shadow-md" />
    </div>
  );
}

export default function ZoneScene({ zone, onAdd, onOpenShroom, onBack }: { zone: Zone; onAdd: () => void; onOpenShroom: (id: string) => void; onBack: () => void }) {
  const data = useMemo(
    () =>
      labels.map((day, index) => ({
        day,
        score: index === 5 ? zone?.score ?? 72 : forecast[index],
      })),
    [zone?.score],
  );

  if (!zone) return <div className="p-6 text-slate-900">Sélectionnez une zone…</div>;

  const openDirections = () => {
    const [lat, lng] = zone.coords;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  const species = Object.entries(zone.species)
    .filter(([, score]) => score > 0)
    .slice(0, 3)
    .map(([id, score]) => ({ mushroom: MUSHROOMS.find((m) => m.id === id), score }))
    .filter((item): item is { mushroom: (typeof MUSHROOMS)[number]; score: number } => Boolean(item.mushroom));

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      className="min-h-dvh bg-[#fbfaf6] px-4 py-6 text-[#14213a] sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between text-[#00452d]">
          <button type="button" onClick={onBack} aria-label="Retour" className="rounded-full p-2 hover:bg-[#edf3e8]">
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button type="button" aria-label="Enregistrer" className="rounded-full p-2 hover:bg-[#edf3e8]">
            <Heart className="h-8 w-8" />
          </button>
        </div>

        <h1 className="font-serif text-6xl font-bold leading-none text-[#00452d] sm:text-7xl">{zone.name}</h1>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-lg text-[#14213a]">
          <span className="inline-flex items-center gap-2"><MapPin className="h-6 w-6" />Secteur Grenoble sud</span>
          <span>•</span>
          <span className="inline-flex items-center gap-2"><Car className="h-6 w-6" />12 min</span>
          <span>•</span>
          <span className="inline-flex items-center gap-2"><Mountain className="h-6 w-6" />Alt. 320 m</span>
        </div>

        <section className="relative mt-9 rounded-[28px] border border-[#efe9df] bg-white/90 p-8 shadow-[0_18px_48px_rgba(32,24,12,0.10)]">
          <button className="absolute -left-7 top-1/2 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full bg-white text-[#00452d] shadow-lg"><ChevronLeft className="h-8 w-8" /></button>
          <button className="absolute -right-7 top-1/2 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full bg-white text-[#00452d] shadow-lg"><ChevronRight className="h-8 w-8" /></button>
          <div className="grid gap-8 md:grid-cols-[1fr_auto_1.1fr] md:items-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#00452d]">{trendLabel(zone.trend)}</p>
              <div className="mt-3 text-7xl font-extrabold text-[#00452d] sm:text-8xl">{zone.score}<span className="text-5xl">%</span></div>
              <p className="mt-2 text-2xl leading-tight">Estimation générale<br />de la zone</p>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#e8f2df] px-5 py-2 font-medium text-[#00452d]"><Leaf className="h-5 w-5" />Version gratuite</span>
            </div>
            <div className="hidden h-72 w-px bg-[#e4dfd6] md:block" />
            <div className="mx-auto w-full max-w-sm">
              <div className="flex items-center justify-between gap-5">
                <WeatherIcon />
                <div><div className="text-7xl font-bold text-[#00452d]">18°</div><div className="mt-2 text-2xl text-slate-600">Nuageux</div></div>
              </div>
              <div className="mt-6 border-t border-[#e4dfd6] pt-5 text-xl">
                <div className="flex items-center justify-between py-2"><span className="inline-flex items-center gap-3 text-slate-600"><Droplets />Humidité</span><b>68%</b></div>
                <div className="flex items-center justify-between py-2"><span className="inline-flex items-center gap-3 text-slate-600"><Wind />Vent</span><b>8 km/h</b></div>
              </div>
            </div>
          </div>
        </section>
        <div className="mt-4 flex justify-center gap-4"><span className="h-3 w-3 rounded-full bg-[#00452d]" />{[1,2,3,4].map(i => <span key={i} className="h-3 w-3 rounded-full bg-[#d8d3ca]" />)}</div>

        <section className="mt-8 rounded-[28px] border border-[#efe9df] bg-white/90 p-8 shadow-[0_18px_48px_rgba(32,24,12,0.08)]">
          <div className="mb-6 flex items-center justify-between gap-4"><h2 className="text-2xl font-bold text-[#00452d]">Évolution sur 10 jours</h2><span className="rounded-full bg-[#eef5e9] px-5 py-2 font-medium text-[#00452d]"><Leaf className="mr-2 inline h-5 w-5" />Prévision jusqu'à 11h</span></div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 22, right: 16, left: 0, bottom: 0 }}>
                <defs><linearGradient id="zoneFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6aa846" stopOpacity={0.28}/><stop offset="100%" stopColor="#6aa846" stopOpacity={0.04}/></linearGradient></defs>
                <CartesianGrid stroke="#e8ded2" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#475569", fontSize: 14 }} axisLine={{ stroke: "#e8ded2" }} tickLine={false} />
                <YAxis domain={[0, 100]} ticks={[0,25,50,75,100]} tickFormatter={(v) => `${v}%`} tick={{ fill: "#475569", fontSize: 14 }} axisLine={false} tickLine={false} width={42} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Area type="monotone" dataKey="score" stroke="#2e7d32" strokeWidth={3} fill="url(#zoneFill)" dot={{ r: 5, strokeWidth: 3, fill: "#fff", stroke: "#0f6b25" }} activeDot={{ r: 7 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <h2 className="mt-9 text-2xl font-bold text-[#00452d]">Espèces potentiellement présentes</h2>
        <div className="mt-5 grid gap-7 md:grid-cols-3">
          {species.map(({ mushroom, score }) => {
            const badge = potentialLabel(score);
            return <button key={mushroom.id} type="button" onClick={() => onOpenShroom(mushroom.id)} className="overflow-hidden rounded-2xl border border-[#efe9df] bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><img src={mushroom.photo} alt="" className="h-44 w-full object-cover" /><div className="p-5"><h3 className="text-2xl font-bold">{mushroom.name}</h3><p className="mt-1 text-lg italic text-slate-500">{mushroom.latin}</p><hr className="my-4" /><p className="text-slate-600">Potentiel de présence</p><div className="mt-2 flex items-center justify-between"><span className="text-4xl font-bold text-[#f05a1a]">{score}%</span><span className={`rounded-full px-4 py-2 ${badge.className}`}>{badge.label}</span></div></div></button>;
          })}
        </div>

        <div className="mt-6 flex items-center gap-5 rounded-2xl bg-white/80 p-5 shadow-sm"><ShieldCheck className="h-14 w-14 shrink-0 text-[#00452d]" /><div><h3 className="text-xl font-bold text-[#00452d]">Rappel sécurité</h3><p>Ne consommez jamais un champignon sans identification certaine.</p></div></div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2"><button onClick={openDirections} className="flex items-center justify-center gap-5 rounded-2xl bg-[#00452d] px-6 py-5 text-2xl font-bold text-white shadow-lg"><Navigation className="h-10 w-10" /><span>Me guider<br /><small className="text-base font-normal">Voir l'itinéraire</small></span></button><button onClick={onAdd} className="flex items-center justify-center gap-5 rounded-2xl border-2 border-[#00452d] bg-white px-6 py-5 text-2xl font-bold text-[#00452d]"><Heart className="h-10 w-10" />Enregistrer</button></div>
        <p className="mt-4 text-slate-500">Source météo : Météo-France · Mise à jour le 12/07 à 08:00</p>
      </div>
    </motion.section>
  );
}
