import React, { useMemo } from "react";
import { motion } from "framer-motion";
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
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MUSHROOMS } from "../data/mushrooms";
import { generateForecast } from "../utils";
import { useT } from "../i18n";
import { useAppContext } from "../context/AppContext";
import type { Zone } from "../types";

export default function ZoneScene({
  zone,
  onAdd,
  onOpenShroom,
  onBack,
}: {
  zone: Zone;
  onAdd: () => void;
  onOpenShroom: (id: string) => void;
  onBack: () => void;
}) {
  const { t } = useT();
  const { state } = useAppContext();
  const data = useMemo(() => generateForecast(state.prefs.lang), [zone?.id, state.prefs.lang]);

  if (!zone) {
    return <div className="p-6 text-slate-900">{t("Sélectionnez une zone…")}</div>;
  }

  const openDirections = () => {
    if (!zone?.coords) return;
    const [lat, lng] = zone.coords;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  const todayIndex = Math.min(5, data.length - 1);
  const displayedScore = zone.score;
  const forecastData = data.slice(2, 13).map((point, index) => ({
    ...point,
    day: index === todayIndex ? "Aujourd'hui" : point.day,
    score: index === todayIndex ? displayedScore : point.score,
  }));
  const currentForecast = forecastData[todayIndex];
  const likelySpecies = Object.entries(zone.species as Record<string, number>)
    .filter(([, score]) => score > 0)
    .slice(0, 3)
    .map(([id, score]) => ({
      mushroom: MUSHROOMS.find((m) => m.id === id),
      score,
    }))
    .filter((entry) => entry.mushroom);
  const trendLabel = "Score stable";

  return (
    <motion.section
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="min-h-screen bg-[#fbf8f1] px-5 py-7 text-[#10213a] sm:px-8"
    >
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-5xl flex-col gap-6 rounded-[2rem] bg-gradient-to-br from-white via-[#fffdf7] to-[#f6f1e8] p-5 shadow-[0_25px_80px_-50px_rgba(15,23,42,0.55)] sm:p-8">
        <header className="space-y-5">
          <div className="flex items-center justify-between text-[#00472d]">
            <button onClick={onBack} aria-label={t("Retour")} className="rounded-full p-2 transition hover:bg-emerald-50">
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button onClick={onAdd} aria-label={t("Enregistrer")} className="rounded-full p-2 transition hover:bg-emerald-50">
              <Heart className="h-8 w-8" />
            </button>
          </div>
          <div>
            <h1 className="font-serif text-6xl font-black leading-none tracking-tight text-[#00472d] sm:text-7xl">{zone.name}</h1>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-base text-[#12223b] sm:text-lg">
              <span className="inline-flex items-center gap-2"><MapPin className="h-6 w-6" /> Secteur Grenoble sud</span>
              <span>•</span>
              <span className="inline-flex items-center gap-2"><Car className="h-6 w-6" /> 12 min</span>
              <span>•</span>
              <span className="inline-flex items-center gap-2"><Mountain className="h-6 w-6" /> Alt. 320 m</span>
            </div>
          </div>
        </header>

        <section className="relative">
          <button aria-label="Zone précédente" className="absolute -left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-3 text-[#00472d] shadow-lg sm:-left-6">
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button aria-label="Zone suivante" className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-3 text-[#00472d] shadow-lg sm:-right-6">
            <ChevronRight className="h-7 w-7" />
          </button>
          <div className="grid gap-6 rounded-[1.75rem] border border-[#eee6da] bg-white/90 p-6 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.7)] md:grid-cols-[1fr_1px_1fr] md:p-10">
            <div className="flex flex-col items-center justify-center text-center">
              <p className="text-2xl font-extrabold text-[#00472d]">{trendLabel || "Score stable"}</p>
              <div className="mt-2 text-7xl font-black leading-none text-[#00472d] sm:text-8xl">{displayedScore}<span className="text-5xl">%</span></div>
              <p className="mt-2 max-w-xs text-2xl leading-tight">Estimation générale<br />de la zone</p>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#eaf2e3] px-5 py-2 text-sm font-semibold text-[#00472d]"><Leaf className="h-5 w-5" /> Version gratuite</span>
            </div>
            <div className="hidden bg-[#e7dfd4] md:block" />
            <div className="flex flex-col justify-center">
              <div className="grid grid-cols-[auto_1fr] items-center gap-6 border-b border-[#e7dfd4] pb-6">
                <CloudSun className="h-28 w-28 text-amber-400" />
                <div>
                  <div className="text-6xl font-black text-[#00472d]">18°</div>
                  <div className="mt-2 text-xl text-[#536078]">Nuageux</div>
                </div>
              </div>
              <div className="grid gap-4 pt-5 text-xl text-[#536078]">
                <div className="flex items-center justify-between"><span className="inline-flex items-center gap-3"><Droplets className="h-6 w-6" /> Humidité</span><span className="font-semibold text-[#10213a]">68%</span></div>
                <div className="flex items-center justify-between"><span className="inline-flex items-center gap-3"><Wind className="h-6 w-6" /> Vent</span><span className="font-semibold text-[#10213a]">8 km/h</span></div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-4">
            {[0, 1, 2, 3, 4].map((dot) => <span key={dot} className={`h-3 w-3 rounded-full ${dot === 0 ? "bg-[#00472d]" : "bg-[#d8d3c9]"}`} />)}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-[#eee6da] bg-white/90 p-5 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.65)] sm:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-extrabold text-[#00472d]">Évolution sur 10 jours</h2>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#eaf2e3] px-5 py-2 text-sm font-semibold text-[#00472d]"><Leaf className="h-5 w-5" /> Prévision jusqu'à 11h</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 22, right: 8, bottom: 0, left: -18 }}>
                <defs><linearGradient id="zoneScore" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#75a957" stopOpacity={0.35} /><stop offset="100%" stopColor="#75a957" stopOpacity={0.04} /></linearGradient></defs>
                <CartesianGrid stroke="#e8dfd2" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#536078", fontSize: 14 }} axisLine={{ stroke: "#e8dfd2" }} tickLine={false} />
                <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={(value) => `${value}%`} tick={{ fill: "#536078", fontSize: 14 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => [`${value}%`, "Score"]} contentStyle={{ borderRadius: 14, border: "1px solid #e8dfd2" }} />
                <ReferenceLine x={currentForecast.day} stroke="#0f6b45" />
                <ReferenceDot x={currentForecast.day} y={displayedScore} r={0} label={{ value: `${displayedScore}%`, position: "top", fill: "#fff", fontSize: 18, fontWeight: 800, offset: 10 }} />
                <Area type="monotone" dataKey="score" stroke="#2e7d32" strokeWidth={3} fill="url(#zoneScore)" dot={{ r: 4, strokeWidth: 3, fill: "#fff", stroke: "#0b6b2a" }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-extrabold text-[#00472d]">Espèces potentiellement présentes</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {likelySpecies.map(({ mushroom, score }) => {
              const level = score >= 75 ? "élevé" : score >= 50 ? "moyen" : "faible";
              const color = score >= 75 ? "text-[#0a6842] bg-[#e7f1df]" : score >= 50 ? "text-[#a36300] bg-[#fff1d2]" : "text-[#f04a17] bg-[#fff0db]";
              return (
                <button key={mushroom!.id} onClick={() => onOpenShroom(mushroom!.id)} className="overflow-hidden rounded-2xl border border-[#eee6da] bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <img src={mushroom!.photo} alt="" className="h-44 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="text-2xl font-extrabold">{mushroom!.name}</h3>
                    <p className="text-lg italic text-[#536078]">{mushroom!.latin}</p>
                    <div className="my-4 border-t border-[#eee6da]" />
                    <p className="text-sm text-[#536078]">Potentiel de présence</p>
                    <div className="mt-1 flex items-center justify-between"><span className={`text-4xl font-black ${score >= 75 ? "text-[#0a6842]" : score >= 50 ? "text-[#f0a11a]" : "text-[#f04a17]"}`}>{score}%</span><span className={`rounded-full px-4 py-2 text-sm font-semibold ${color}`}>{level}</span></div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <div className="flex items-center gap-5 rounded-2xl bg-white/75 px-5 py-4 shadow-sm">
          <ShieldCheck className="h-14 w-14 shrink-0 text-[#00472d]" />
          <div><p className="text-xl font-extrabold text-[#00472d]">Rappel sécurité</p><p className="text-[#536078]">Ne consommez jamais un champignon sans identification certaine.</p></div>
        </div>

        <footer className="grid gap-4 md:grid-cols-2">
          <button onClick={openDirections} className="flex items-center justify-center gap-5 rounded-2xl bg-[#00472d] px-6 py-5 text-xl font-extrabold text-white shadow-lg transition hover:bg-[#00603d]"><Navigation className="h-9 w-9" /><span className="text-left">Me guider<br /><span className="text-base font-medium">Voir l'itinéraire</span></span></button>
          <button onClick={onAdd} className="flex items-center justify-center gap-5 rounded-2xl border-2 border-[#00472d] px-6 py-5 text-xl font-extrabold text-[#00472d] transition hover:bg-emerald-50"><Heart className="h-9 w-9" /> Enregistrer</button>
          <p className="text-sm text-[#7787a3] md:col-span-2">Source météo : Météo-France · Mise à jour le 12/07 à 08:00</p>
        </footer>
      </div>
    </motion.section>
  );
}
