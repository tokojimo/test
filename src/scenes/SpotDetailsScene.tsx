import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3,
  Bookmark,
  ChevronLeft,
  CloudRain,
  Compass,
  Droplets,
  Expand,
  Info,
  Leaf,
  MapPin,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BTN_GHOST_ICON, T_SUBTLE } from "../styles/tokens";
import { useT } from "../i18n";
import type { Spot } from "../types";
import { loadMap } from "@/services/openstreetmap";
import type { StyleSpecification } from "maplibre-gl";
import { useAppContext } from "../context/AppContext";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { MUSHROOMS } from "@/data/mushrooms";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, ReferenceLine, Tooltip } from "recharts";

const scoreData = [
  { day: "J-5", score: 64 },
  { day: "J-4", score: 56 },
  { day: "J-3", score: 49 },
  { day: "J-2", score: 59 },
  { day: "J-1", score: 63 },
  { day: "Aujourd'hui", score: 78 },
  { day: "J+1", score: 76 },
  { day: "J+2", score: 83 },
  { day: "J+3", score: 91 },
  { day: "J+4", score: 90 },
  { day: "J+5", score: 85 },
];

function ScoreCard({ icon: Icon, title, score, caption, badge, tone }: { icon: typeof Leaf; title: string; score: number; caption: string; badge?: string; tone: "green" | "mint" }) {
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className={`rounded-2xl border p-4 ${tone === "green" ? "border-emerald-900/10 bg-emerald-50/70" : "border-teal-900/10 bg-teal-50/70"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 text-[15px] font-semibold text-foreground">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-700 text-white shadow-sm"><Icon className="h-5 w-5" /></span>
          {title}
          <Info className="h-4 w-4 opacity-80" />
        </div>
        {badge && <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">{badge}</span>}
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <div className="text-6xl font-black leading-none tracking-tight text-emerald-900">{score}<span className="text-4xl">%</span></div>
          <div className="mt-2 flex items-center gap-2 text-sm font-medium text-emerald-800"><Icon className="h-4 w-4" />{caption}</div>
        </div>
        <svg className="h-28 w-28 -rotate-90" viewBox="0 0 90 90" aria-hidden="true">
          <circle cx="45" cy="45" r="36" fill="none" stroke="rgb(209 250 229)" strokeWidth="12" />
          <circle cx="45" cy="45" r="36" fill="none" stroke="rgb(4 120 87)" strokeWidth="12" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
        </svg>
      </div>
    </div>
  );
}

export default function SpotDetailsScene({ spot, onBack }: { spot: Spot | null; onBack: () => void }) {
  const { t } = useT();
  const { dispatch } = useAppContext();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);

  const mushroom = useMemo(() => MUSHROOMS.find((item) => item.id === spot?.species?.[0]) ?? MUSHROOMS.find((item) => item.id === "morille_commune") ?? MUSHROOMS[0], [spot?.species]);
  const mushroomOptions = useMemo(() => [mushroom, ...MUSHROOMS.filter((item) => item.id !== mushroom.id).slice(0, 2)], [mushroom]);

  useEffect(() => {
    if (!spot?.location || mapRef.current || !mapContainerRef.current) return;
    const [lat, lng] = spot.location.split(",").map((v) => parseFloat(v.trim()));
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;
    loadMap().then((maplibregl) => {
      const osmStyle: StyleSpecification = {
        version: 8,
        sources: { osm: { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256, attribution: "© OpenStreetMap contributors" } },
        layers: [{ id: "osm", type: "raster", source: "osm", minzoom: 0, maxzoom: 19 }],
      };
      const map = new maplibregl.Map({ container: mapContainerRef.current as HTMLDivElement, style: osmStyle, center: [lng, lat], zoom: 12, interactive: false });
      mapRef.current = map;
      const marker = document.createElement("div");
      marker.className = "grid h-11 w-9 place-items-center rounded-t-full rounded-b-md bg-emerald-950 text-xl shadow-lg";
      marker.textContent = "🍄";
      new maplibregl.Marker({ element: marker }).setLngLat([lng, lat]).addTo(map);
    });
    return () => { mapRef.current?.remove(); mapRef.current = null; };
  }, [spot?.location]);

  if (!spot) return null;

  const sourceDate = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });

  return (
    <section className="min-h-screen p-3 text-foreground sm:p-4">
      <div className="mx-auto max-w-5xl">
        <div className="relative mb-3 flex h-16 items-center justify-center">
          <Button variant="ghost" size="icon" onClick={onBack} className={`absolute left-0 h-12 w-12 ${BTN_GHOST_ICON}`} aria-label={t("Retour")}><ChevronLeft className="h-8 w-8" /></Button>
          <h1 className="text-center font-serif text-5xl font-black leading-none tracking-tight text-emerald-950 sm:text-7xl">{spot.name || "Les Roberts"}</h1>
          <Button variant="ghost" size="icon" className={`absolute right-0 ${BTN_GHOST_ICON}`} onClick={() => setConfirmOpen(true)} aria-label={t("supprimer")}><Trash2 className="h-5 w-5" /></Button>
        </div>

        <div className="mb-3 text-lg font-extrabold">Choisir un champignon</div>
        <div className="no-scrollbar mb-4 flex gap-3 overflow-x-auto pb-1">
          {mushroomOptions.map((item, index) => <button key={item.id} className={`flex shrink-0 items-center gap-3 rounded-3xl border px-5 py-3 text-base shadow-sm ${index === 0 ? "border-emerald-900 bg-white/80 font-extrabold" : "border-neutral-200 bg-white/70"}`}><span className="text-2xl">🍄</span>{item.name}</button>)}
          <button className="shrink-0 rounded-3xl border border-neutral-200 bg-white/70 px-7 py-3 text-base shadow-sm">+17</button>
        </div>

        <div className="grid gap-3 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-neutral-200 bg-white/80 p-3 shadow-sm"><img src={spot.cover || mushroom.photo} alt="" className="h-[24rem] w-full rounded-2xl object-cover lg:h-full" /></div>
          <div className="rounded-3xl border border-neutral-200 bg-white/80 p-4 shadow-sm">
            <h2 className="font-serif text-4xl font-black leading-none text-emerald-950 sm:text-5xl">{mushroom.name}</h2>
            <p className="mb-4 text-2xl font-bold italic text-foreground/45">{mushroom.latin}</p>
            <div className="grid gap-3"><ScoreCard icon={Leaf} title="Score de base" score={78} caption="Conditions naturelles" badge="Gratuit" tone="green" /><ScoreCard icon={CloudRain} title="Score ajusté météo" score={85} caption="Conditions réelles" tone="mint" /></div>
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-neutral-200 bg-white/80 p-4 shadow-sm"><div className="mb-2 flex items-center gap-3 text-xl font-extrabold"><MapPin className="h-8 w-8" />Carte</div><div className="relative h-44 overflow-hidden rounded-2xl bg-emerald-50"><div ref={mapContainerRef} className="absolute inset-0" />{!spot.location && <div className="grid h-full place-items-center text-sm text-foreground/60">Position à renseigner</div>}<button className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-white/90"><Expand className="h-5 w-5" /></button></div></div>
          <div className="rounded-3xl border border-neutral-200 bg-white/80 p-5 shadow-sm"><div className="mb-2 flex items-center gap-3 text-xl font-extrabold"><CloudRain className="h-8 w-8" />Météo</div><div className="text-6xl font-black leading-tight text-emerald-950">18°C</div><div className="space-y-2 text-lg"><div className="flex items-center gap-3"><CloudRain className="h-6 w-6" />Pluie</div><div className="flex items-center gap-3"><Droplets className="h-6 w-6" />Humidité 82%</div></div></div>
        </div>

        <div className="mt-3 rounded-3xl border border-neutral-200 bg-white/80 p-4 shadow-sm"><div className="mb-1 flex items-center gap-3 text-xl font-extrabold"><BarChart3 className="h-7 w-7" />Évolution sur 10 jours</div><div className="h-56"><ResponsiveContainer width="100%" height="100%"><AreaChart data={scoreData} margin={{ top: 18, right: 14, bottom: 0, left: -12 }}><defs><linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#047857" stopOpacity={0.28}/><stop offset="100%" stopColor="#047857" stopOpacity={0.02}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(15, 118, 110, 0.14)"/><XAxis dataKey="day" tick={{ fontSize: 12, fill: "#334155", fontWeight: 700 }} interval={0}/><YAxis domain={[0, 100]} ticks={[0,25,50,75,100]} tickFormatter={(value) => `${value}%`} tick={{ fontSize: 12, fill: "#334155" }}/><Tooltip/><ReferenceLine x="Aujourd'hui" stroke="#047857"/><Area type="monotone" dataKey="score" stroke="#047857" strokeWidth={3} fill="url(#scoreFill)" dot={{ r: 4, fill: "white", strokeWidth: 3 }}/></AreaChart></ResponsiveContainer></div></div>

        <div className="mt-3 rounded-3xl border border-neutral-200 bg-white/80 p-4 shadow-sm"><div className="flex items-center gap-4"><ShieldCheck className="h-14 w-14 text-emerald-800" /><div><div className="text-2xl font-extrabold">Rappel sécurité</div><p className={T_SUBTLE}>Ne consommez jamais un champignon sans identification certaine.</p></div></div><div className="mt-3 grid gap-3 sm:grid-cols-2"><Button className="h-14 rounded-2xl bg-emerald-950 text-lg font-extrabold text-white hover:bg-emerald-900"><Compass className="mr-3 h-6 w-6" />Me guider</Button><Button className="h-14 rounded-2xl bg-emerald-950 text-lg font-extrabold text-white hover:bg-emerald-900"><Bookmark className="mr-3 h-6 w-6" />Ajouter à mes coins</Button></div></div>
        <p className="py-2 text-center text-sm text-foreground/45">Source météo : Météo-France • Mise à jour le {sourceDate} à 08:00</p>
      </div>
      <ConfirmDeleteModal open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={() => { dispatch({ type: "removeSpot", id: spot.id }); setConfirmOpen(false); onBack(); }} />
    </section>
  );
}
