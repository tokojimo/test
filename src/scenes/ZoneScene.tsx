import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  ChevronLeft,
  CloudRain,
  Compass,
  Expand,
  Info,
  Leaf,
  MapPin,
  ShieldCheck,
  Sprout,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
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

const dayLabels = [
  "J-5",
  "J-4",
  "J-3",
  "J-2",
  "J-1",
  "Aujourd'hui",
  "J+1",
  "J+2",
  "J+3",
  "J+4",
  "J+5",
];

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
  const data = useMemo(
    () => generateForecast(state.prefs.lang),
    [zone?.id, state.prefs.lang],
  );
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string | null>(
    null,
  );

  if (!zone) {
    return (
      <div className="p-6 text-slate-900">{t("Sélectionnez une zone…")}</div>
    );
  }

  const speciesScores = Object.entries(zone.species as Record<string, number>)
    .filter(([, score]) => score > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([id, score]) => ({
      mushroom: MUSHROOMS.find((m) => m.id === id),
      score,
    }))
    .filter((entry) => entry.mushroom);
  const visibleSpecies = speciesScores.slice(0, 3);
  const selectedSpecies =
    speciesScores.find(({ mushroom }) => mushroom!.id === selectedSpeciesId) ??
    speciesScores[0];
  const mushroom = selectedSpecies?.mushroom ?? MUSHROOMS[0];
  const baseScore = selectedSpecies?.score ?? zone.score;
  const adjustedScore = Math.min(99, baseScore + 7);
  const trendData = dayLabels.map((label, index) => ({
    label,
    score: Math.max(
      35,
      Math.min(
        92,
        baseScore -
          13 +
          index * 3 +
          (index % 3) * 5 +
          ((data[index % data.length]?.score ?? 0) % 5),
      ),
    ),
  }));
  trendData[5].score = baseScore;
  const [lat, lng] = zone.coords;
  const staticMapUrl = getStaticMapUrl(lat, lng, 520, 190, 14);

  const openDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank",
    );
  };

  return (
    <motion.section
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="h-screen overflow-hidden bg-[#fbf8f1] px-3 py-2 text-[#003f2a] sm:px-5 lg:py-3"
    >
      <div className="mx-auto flex h-full w-full max-w-[1180px] flex-col gap-2">
        <header className="relative text-center">
          <button
            onClick={onBack}
            aria-label={t("Retour")}
            className="absolute left-0 top-0 rounded-full p-1 text-[#003f2a] transition hover:bg-emerald-50"
          >
            <ChevronLeft className="h-7 w-7 stroke-[2.6]" />
          </button>
          <h1 className="font-serif text-[2.35rem] font-black leading-none tracking-tight drop-shadow-sm sm:text-[3.15rem]">
            {zone.name}
          </h1>
        </header>

        <section className="space-y-1">
          <h2 className="text-lg font-extrabold">Choisir un champignon</h2>
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {visibleSpecies.map(({ mushroom: species }) => {
              const active = species!.id === mushroom.id;
              return (
                <button
                  key={species!.id}
                  onClick={() => setSelectedSpeciesId(species!.id)}
                  className={`flex min-w-[150px] shrink-0 items-center justify-center gap-2 rounded-2xl border bg-white px-4 py-2 text-base shadow-[0_12px_28px_-18px_rgba(15,23,42,0.55)] transition ${active ? "border-[#00543a] font-extrabold ring-1 ring-[#00543a]" : "border-[#eee6da] hover:border-[#9eb6a8]"}`}
                >
                  <img
                    src={species!.photo}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover"
                  />
                  {species!.name}
                </button>
              );
            })}
            {speciesScores.length > 3 && (
              <button className="shrink-0 rounded-2xl border border-[#eee6da] bg-white px-6 py-2 text-base shadow-[0_12px_28px_-18px_rgba(15,23,42,0.55)]">
                +{speciesScores.length - 3}
              </button>
            )}
          </div>
        </section>

        <section className="grid flex-1 min-h-0 gap-3 rounded-[1.25rem] border border-[#efe8dc] bg-white p-3 shadow-[0_20px_55px_-42px_rgba(15,23,42,0.85)] md:grid-cols-[0.8fr_1.2fr]">
          <img
            src={mushroom.photo}
            alt={mushroom.name}
            className="h-full min-h-[180px] w-full rounded-2xl object-cover"
          />
          <div className="space-y-2 py-1">
            <div>
              <h2 className="font-serif text-3xl font-black leading-tight sm:text-4xl">
                {mushroom.name}
              </h2>
              <p className="text-xl font-bold italic text-[#8b8d95]">
                {mushroom.latin}
              </p>
            </div>
            <ScoreCard
              label="Score de base"
              score={baseScore}
              caption="Conditions naturelles"
              badge="Gratuit"
              icon={<Leaf className="h-5 w-5" />}
              tone="warm"
            />
            <ScoreCard
              label="Score ajusté météo"
              score={adjustedScore}
              caption="Conditions réelles"
              icon={<CloudRain className="h-5 w-5" />}
              tone="cool"
            />
          </div>
        </section>

        <section className="grid gap-2 md:grid-cols-[1fr_0.8fr]">
          <InfoCard
            title="Carte"
            icon={<MapPin className="h-9 w-9" />}
            action={<Expand className="h-5 w-5" />}
            onClick={() => onOpenMap(zone)}
          >
            <div className="relative h-[96px] overflow-hidden rounded-2xl bg-[#eef1ea]">
              <img
                src={staticMapUrl}
                alt=""
                className="h-full w-full object-cover opacity-80"
              />
              <img
                src={Logo}
                alt=""
                className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 drop-shadow-lg"
              />
            </div>
          </InfoCard>
          <InfoCard title="Météo" icon={<CloudRain className="h-10 w-10" />}>
            <div className="grid gap-1 text-base">
              <p className="text-4xl font-black leading-none">18°C</p>
              <p className="flex items-center gap-3">
                <CloudRain className="h-5 w-5" /> Pluie
              </p>
              <p className="flex items-center gap-3">
                <Sprout className="h-5 w-5" /> Humidité 82%
              </p>
            </div>
          </InfoCard>
        </section>

        <section className="rounded-[1.25rem] border border-[#efe8dc] bg-white p-3 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.75)]">
          <h2 className="mb-1 flex items-center gap-2 text-lg font-extrabold">
            <TrendingUp className="h-8 w-8" /> Évolution sur 10 jours
          </h2>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 18, right: 12, bottom: 4, left: -18 }}
              >
                <defs>
                  <linearGradient id="zoneTrend" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#178c3a" stopOpacity={0.24} />
                    <stop
                      offset="100%"
                      stopColor="#178c3a"
                      stopOpacity={0.03}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="#e7e3da"
                  strokeDasharray="4 4"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#536078", fontSize: 14, fontWeight: 700 }}
                  axisLine={{ stroke: "#d8d6d0" }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fill: "#536078", fontSize: 14 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip formatter={(value) => `${value}%`} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#08752f"
                  strokeWidth={3}
                  fill="url(#zoneTrend)"
                  dot={{
                    r: 4,
                    strokeWidth: 3,
                    fill: "#fbf8f1",
                    stroke: "#08752f",
                  }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-[1.25rem] border border-[#efe8dc] bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-10 w-10 shrink-0 text-[#00543a]" />
            <div>
              <p className="text-lg font-extrabold">Rappel sécurité</p>
              <p className="text-sm text-[#536078]">
                Ne consommez jamais un champignon sans identification certaine.
              </p>
            </div>
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <button
              onClick={openDirections}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#00543a] px-4 py-2 text-base font-extrabold text-white shadow-sm"
            >
              <Compass className="h-8 w-8" /> Me guider
            </button>
            <button
              onClick={onAdd}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#00543a] px-4 py-2 text-base font-extrabold text-white shadow-sm"
            >
              <Bookmark className="h-8 w-8" /> Ajouter à mes coins
            </button>
          </div>
        </section>
        <p className="text-center text-xs text-[#8b8d95]">
          Source météo : Météo-France · Mise à jour le 12/07 à 08:00
        </p>
      </div>
    </motion.section>
  );
}

function ScoreCard({
  label,
  score,
  caption,
  badge,
  icon,
  tone,
}: {
  label: string;
  score: number;
  caption: string;
  badge?: string;
  icon: React.ReactNode;
  tone: "warm" | "cool";
}) {
  return (
    <div
      className={`rounded-2xl border p-3 ${tone === "warm" ? "border-[#dbe9d8] bg-[#f4fbf0]" : "border-[#cfe7df] bg-[#eefbf8]"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-base font-extrabold">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#168344] text-white">
            {icon}
          </span>
          {label}
          <Info className="h-5 w-5" />
        </h3>
        {badge && (
          <span className="rounded-xl bg-[#d9ebd3] px-3 py-1 text-sm font-bold">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <div className="text-[3.3rem] font-black leading-none tracking-tight text-[#006234]">
            {score}
            <span className="text-3xl">%</span>
          </div>
          <p className="mt-1 flex items-center gap-2 text-base">
            <span className="text-[#168344]">{icon}</span>
            {caption}
          </p>
        </div>
        <CircularProgress value={score} />
      </div>
    </div>
  );
}

function CircularProgress({ value }: { value: number }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24 shrink-0 -rotate-90">
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke="#d7ead8"
        strokeWidth="14"
        fill="none"
      />
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke="#168344"
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - value / 100)}
      />
    </svg>
  );
}

function InfoCard({
  title,
  icon,
  action,
  onClick,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.25rem] border border-[#efe8dc] bg-white p-3 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.75)]">
      <div className="mb-1 flex items-center justify-between text-[#003f2a]">
        <h2 className="flex items-center gap-2 text-lg font-extrabold">
          {icon}
          {title}
        </h2>
        {action && (
          <button
            onClick={onClick}
            className="rounded-full bg-white/80 p-2 shadow-sm hover:bg-emerald-50"
          >
            {action}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
