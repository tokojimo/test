import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CloudSun,
  Droplets,
  Leaf,
  Maximize2,
  Route,
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
import { getStaticMapUrl } from "../services/openstreetmap";
import Logo from "@/assets/logo.png";
import type { Zone } from "../types";

export default function ZoneScene({
  zone,
  onAdd,
  onOpenShroom,
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
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const data = useMemo(() => generateForecast(state.prefs.lang), [zone?.id, state.prefs.lang]);

  const scrollCarousel = (direction: -1 | 1) => {
    const node = carouselRef.current;
    if (!node) return;
    const next = (activeSlide + direction + 2) % 2;
    node.scrollTo({ left: next * node.clientWidth, behavior: "smooth" });
    setActiveSlide(next);
  };

  useEffect(() => {
    const node = carouselRef.current;
    if (!node) return;
    const handleScroll = () => {
      const next = Math.round(node.scrollLeft / Math.max(1, node.clientWidth));
      setActiveSlide(Math.max(0, Math.min(1, next)));
    };
    node.addEventListener("scroll", handleScroll, { passive: true });
    return () => node.removeEventListener("scroll", handleScroll);
  }, []);

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
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([id, score]) => ({
      mushroom: MUSHROOMS.find((m) => m.id === id),
      score,
    }))
    .filter((entry) => entry.mushroom);
  const [lat, lng] = zone.coords;
  const staticMapUrl = getStaticMapUrl(lat, lng, 520, 260, 13);
  const openMap = () => onOpenMap(zone);

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
            <span className="h-12 w-12" aria-hidden />
          </div>
          <div className="-mt-4 text-center sm:-mt-8">
            <h1 className="font-serif text-5xl font-black leading-none tracking-tight text-[#00472d] sm:text-7xl">{zone.name}</h1>
          </div>
        </header>

        <section className="relative">
          <button type="button" onClick={() => scrollCarousel(-1)} aria-label="Carte précédente" className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-forest/15 bg-white p-3.5 text-[#00472d] shadow-[0_14px_34px_-12px_rgba(15,35,58,0.7)] ring-4 ring-white/70 transition hover:scale-105 hover:bg-emerald-50 sm:-left-8">
            <ChevronLeft className="h-7 w-7 stroke-[3]" />
          </button>
          <button type="button" onClick={() => scrollCarousel(1)} aria-label="Carte suivante" className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-forest/15 bg-white p-3.5 text-[#00472d] shadow-[0_14px_34px_-12px_rgba(15,35,58,0.7)] ring-4 ring-white/70 transition hover:scale-105 hover:bg-emerald-50 sm:-right-8">
            <ChevronRight className="h-7 w-7 stroke-[3]" />
          </button>
          <div ref={carouselRef} className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="grid min-w-full snap-center gap-5 rounded-3xl border border-border bg-white p-5 shadow-sm md:grid-cols-2 md:p-6">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="mt-1 text-6xl font-black leading-none text-forest sm:text-7xl">{displayedScore}<span className="text-3xl">%</span></div>
                <p className="mt-2 max-w-xs text-base leading-tight text-foreground/80">Estimation générale<br />de la zone</p>
                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-forest/10 px-4 py-2 text-xs font-medium text-forest"><Leaf className="h-4 w-4" /> Version gratuite</span>
              </div>
              <div className="relative min-h-56 overflow-hidden rounded-2xl border border-border bg-secondary">
                <img src={staticMapUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <img src={Logo} alt="" className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-full" />
                <button type="button" onClick={openMap} aria-label="Agrandir la carte" className="absolute right-3 top-3 rounded-full bg-paper/90 p-2 text-forest shadow-sm transition hover:bg-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                  <Maximize2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid min-w-full snap-center gap-5 rounded-3xl border border-border bg-white p-5 shadow-sm md:grid-cols-2 md:p-6">
              <div className="flex flex-col items-center justify-center text-center md:border-r md:border-border/80 md:pr-6">
                <p className="text-xl font-extrabold uppercase tracking-[0.18em] text-forest sm:text-2xl">Potentiel du jour</p>
                <div className="mt-2 text-7xl font-black leading-none text-forest sm:text-8xl">{displayedScore}<span className="text-4xl sm:text-5xl">%</span></div>
                <p className="mt-3 text-base font-semibold text-foreground/70 sm:text-lg">Score de base {Math.max(0, displayedScore - 6)}% · Météo +6 pts</p>
                <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-forest/10 px-5 py-2.5 text-sm font-bold text-forest"><Leaf className="h-5 w-5" /> Conditions favorables</span>
              </div>
              <div className="flex flex-col justify-center rounded-2xl p-5 md:pl-6">
                <div className="grid grid-cols-[auto_1fr] items-center gap-5 border-b border-border pb-5">
                  <CloudSun className="h-20 w-20 text-amber-400" />
                  <div>
                    <div className="text-5xl font-black text-forest">18°</div>
                    <div className="mt-1 text-sm text-foreground/70">Nuageux</div>
                  </div>
                </div>
                <div className="grid gap-3 pt-4 text-sm text-foreground/70">
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2"><Droplets className="h-4 w-4" /> Humidité</span><span className="font-medium text-foreground">68%</span></div>
                  <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2"><Wind className="h-4 w-4" /> Vent</span><span className="font-medium text-foreground">8 km/h</span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 flex justify-center gap-3">
            {[0, 1].map((index) => (
              <span key={index} className={`h-2.5 w-2.5 rounded-full transition-colors ${activeSlide === index ? "bg-forest" : "bg-border"}`} />
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-[#eee6da] bg-white/90 p-5 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.65)] sm:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-extrabold text-[#00472d]">Évolution sur 10 jours</h2>
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

        <footer className="flex flex-wrap items-center gap-3">
          <button onClick={openDirections} className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-paper shadow-sm transition hover:bg-moss focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"><Route className="h-5 w-5" /> Me guider</button>
          <button onClick={onAdd} className="inline-flex items-center justify-center rounded-full bg-forest px-5 py-3 text-sm font-semibold text-paper shadow-sm transition hover:bg-moss focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">Ajouter à mes coins</button>
          <p className="basis-full text-xs text-foreground/50">Source météo : Météo-France · Mise à jour le 12/07 à 08:00</p>
        </footer>
      </div>
    </motion.section>
  );
}
