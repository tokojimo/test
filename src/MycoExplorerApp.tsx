import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Compass, Download, Plus, Settings, Search, ChevronRight, ChevronLeft, TriangleAlert, CloudSun, Calendar, Trees, Route, LocateFixed, ChefHat, Info, Sandwich, Menu, X, RefreshCw, Pencil, Images, Maximize2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useAppContext } from "./context/AppContext";

// Palette & typographies adaptées au thème sombre
const BTN = "rounded-xl bg-neutral-300 text-neutral-900 hover:bg-neutral-200";
const BTN_GHOST_ICON = "text-neutral-300 hover:bg-neutral-800";
const T_PRIMARY = "text-neutral-100";
const T_MUTED = "text-neutral-300";
const T_SUBTLE = "text-neutral-400";

function MushroomIcon(props){
  return (
    <svg viewBox="0 0 24 24" width={props.size||40} height={props.size||40} fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
      <path d="M12 3c-5.5 0-9 3.2-9 6.5 0 1.4 1.3 2.5 2.8 2.5h12.4c1.5 0 2.8-1.1 2.8-2.5C21 6.2 17.5 3 12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 12v1.5A4 4 0 0 0 12 17a4 4 0 0 0 4-3.5V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const MUSHROOMS = [
  { id: "cepe", name: "Cèpe de Bordeaux", latin: "Boletus edulis", edible: true, season: "Août – Novembre", habitat: "Feuillus & conifères, sols acides, 200–1200 m, lisières et clairières", weatherIdeal: "Pluies modérées suivies de 3–5 jours doux (12–20°C), vent faible", description: "Chapeau brun-noisette, pied ventru réticulé, tubes blancs devenant verdâtres, chair blanche", culinary: "Excellente. Poêlé, en fricassée, séchage possible", cookingTips: "Saisir à feu vif dans un peu de matière grasse, ne pas laver à grande eau (brosse + chiffon)", dishes: ["Omelette aux cèpes", "Poêlée de cèpes persillés", "Tagliatelles aux cèpes", "Cèpes rôtis au four"], confusions: ["Bolet amer (Tylopilus felleus)", "Bolets à pores rouges (toxiques)"], picking: "Couper au couteau, reboucher le trou, prélever raisonnablement", photo: "https://images.unsplash.com/photo-1603296196270-937b36cf47b1?q=80&w=1600&auto=format&fit=crop" },
  { id: "girolle", name: "Girolle (Chanterelle)", latin: "Cantharellus cibarius", edible: true, season: "Juin – Octobre", habitat: "Bois de conifères & feuillus, mousses, pentes bien drainées", weatherIdeal: "Alternance d'averses et de beaux jours, 14–22°C", description: "Chapeau jaune cône-ombiliqué, plis décurrents, odeur fruitée d'abricot", culinary: "Excellente. Sautés courts, risotto, pickles", cookingTips: "Déposer en fin de cuisson pour conserver le croquant, éviter l'excès d'eau", dishes: ["Risotto aux girolles", "Volaille sauce girolles", "Tartine forestière", "Pickles de girolles"], confusions: ["Clitocybe de l'olivier (toxique)", "Fausse girolle (Hygrophoropsis aurantiaca)"], picking: "Prélever les plus développées, laisser les jeunes", photo: "https://images.unsplash.com/photo-1631460615580-bbbc9efeb800?q=80&w=1600&auto=format&fit=crop" },
  { id: "morille", name: "Morille commune", latin: "Morchella esculenta", edible: true, season: "Mars – Mai", habitat: "Lisières, vergers, ripisylves, sols calcaires", weatherIdeal: "Redoux printanier après pluies, 8–18°C", description: "Chapeau alvéolé en nid d'abeille, pied blanc-creme, chair creuse", culinary: "Excellente mais TOUJOURS bien cuite", cookingTips: "Sécher possible. Réhydrater puis cuire longuement. Jamais crue", dishes: ["Morilles à la crème", "Poulet aux morilles", "Pâtes aux morilles", "Tartes salées aux morilles"], confusions: ["Gyromitre (toxique)", "Morillons (autres Morchella)"], picking: "Gants recommandés pour la cueillette; longue cuisson obligatoire", photo: "https://images.unsplash.com/photo-1587307360679-f20b5cbd9e03?q=80&w=1600&auto=format&fit=crop" }
];

const DEMO_ZONES = [
  { id: "zone-alpage", name: "Clairière des Alpages", score: 88, species: { cepe: 90, girolle: 75, morille: 0 }, trend: "⬈ amélioration", coords: [45.9, 6.6] },
  { id: "zone-ripisylve", name: "Ripisylve du Vieux Pont", score: 72, species: { cepe: 40, girolle: 55, morille: 85 }, trend: "⬊ en baisse", coords: [45.7, 5.9] },
  { id: "zone-lisiere", name: "Grande Lisière Sud", score: 53, species: { cepe: 60, girolle: 50, morille: 15 }, trend: "→ stable", coords: [45.6, 6.1] }
];

const LEGEND = [
  { label: ">85", color: "bg-emerald-700" },
  { label: "84–75", color: "bg-emerald-600" },
  { label: "74–50", color: "bg-yellow-600" },
  { label: "49–35", color: "bg-orange-600" },
  { label: "34–25", color: "bg-red-600" }
];

function classNames(...c){return c.filter(Boolean).join(" ");}

function generateForecast(){
  const days = [];
  const today = new Date();
  for (let i=-7;i<=7;i++){
    const d = new Date(today);
    d.setDate(today.getDate()+i);
    days.push({ day: d.toLocaleDateString("fr-FR", { day:"2-digit", month:"2-digit" }), score: Math.max(10, Math.min(100, Math.round(60 + 25*Math.sin(i/2) + (Math.random()*10-5)))) });
  }
  return days;
}

export default function MycoExplorerApp(){
  const [scene, setScene] = useState(1);
  const [history, setHistory] = useState([1]);
  const [search, setSearch] = useState("");
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedMushroom, setSelectedMushroom] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [dlProgress, setDlProgress] = useState(0);
  const [includeRelief, setIncludeRelief] = useState(true);
  const [includeWeather, setIncludeWeather] = useState(true);
  const [packSize, setPackSize] = useState(180);
  const [deviceFree, setDeviceFree] = useState(2048);
  const [toast, setToast] = useState(null);
  const [gpsFollow, setGpsFollow] = useState(false);
  const { dispatch } = useAppContext();

  const goToScene = useCallback((next) => {
    setScene(next);
    setHistory(h => [...h, next]);
  }, []);

  const goBack = useCallback(() => {
    setHistory(h => {
      if (h.length <= 1) return h;
      const newHistory = h.slice(0, -1);
      setScene(newHistory[newHistory.length - 1]);
      return newHistory;
    });
  }, []);

  useEffect(()=>{
    if(downloading){
      const id = setInterval(()=>{
        setDlProgress(p=>{
          const next = Math.min(100, p + Math.random()*15);
          if(next>=100){
            clearInterval(id);
            setTimeout(()=>{ setDownloading(false); setToast({ type:"success", text:"Carte téléchargée et prête hors‑ligne" }); goToScene(2); }, 500);
          }
          return next;
        });
      }, 500);
      return ()=>clearInterval(id);
    }
  }, [downloading, goToScene]);

  const filteredMushrooms = useMemo(()=> MUSHROOMS.filter(m=>m.name.toLowerCase().includes(search.toLowerCase())),[search]);

  return (
    <div className="w-full min-h-screen bg-neutral-950">
      {toast && (
        <div className={classNames("fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-xl px-4 py-2 shadow-xl", toast.type==="success"?"bg-emerald-600 "+T_PRIMARY:"bg-amber-600 "+T_PRIMARY)} onAnimationEnd={()=> setTimeout(()=> setToast(null), 2500)}>
          {toast.text}
        </div>
      )}

      <main>
        <AnimatePresence mode="wait">
          {scene===1 && <Scene1 key="s1" onSeeMap={()=>goToScene(2)} onMySpots={()=>goToScene(4)} onOpenSettings={()=>goToScene(8)} onOpenPicker={()=>goToScene(6)} />}
          {scene===2 && <Scene2 key="s2" onBack={goBack} gpsFollow={gpsFollow} setGpsFollow={setGpsFollow} onZone={(z)=>{setSelectedZone(z); goToScene(3);}} onOpenShroom={(id)=>{setSelectedMushroom(MUSHROOMS.find(m=>m.id===id)); goToScene(7);}} />}
          {scene===3 && <Scene3 key="s3" zone={selectedZone} onGo={()=> goToScene(5)} onAdd={()=>{ const today=new Date().toISOString().slice(0,10); dispatch({ type:'ADD_SPOT', spot:{ id:Date.now(), cover:MUSHROOMS[1].photo, photos:[MUSHROOMS[1].photo], name:selectedZone?.name, species: Object.keys(selectedZone?.species||{}), rating:5, last:today, history:[{date:today, rating:5, note:"Créé", photos:[MUSHROOMS[1].photo]}] }}); setToast({ type:"success", text:"Coin ajouté"}); }} onOpenShroom={(id)=>{setSelectedMushroom(MUSHROOMS.find(m=>m.id===id)); goToScene(7);}} onBack={goBack} />}
          {scene===4 && <Scene4 key="s4" onRoute={()=> goToScene(5)} onBack={goBack} />}
          {scene===5 && <Scene5 key="s5" onBackToMap={()=> goToScene(2)} onBack={goBack} />}
          {scene===6 && <Scene6 key="s6" items={filteredMushrooms} search={search} setSearch={setSearch} onPick={(m)=>{ setSelectedMushroom(m); goToScene(7); }} onBack={goBack} />}
          {scene===7 && <Scene7 key="s7" item={selectedMushroom} onSeeZones={()=> goToScene(2)} onBack={goBack} />}
          {scene===8 && <Scene8 key="s8" onOpenPacks={()=> goToScene(9)} onBack={goBack} />}
          {scene===9 && <Scene9 key="s9" packSize={packSize} setPackSize={setPackSize} deviceFree={deviceFree} setDeviceFree={setDeviceFree} includeRelief={includeRelief} setIncludeRelief={setIncludeRelief} includeWeather={includeWeather} setIncludeWeather={setIncludeWeather} downloading={downloading} dlProgress={dlProgress} onStart={()=>{
              if(packSize>deviceFree){ setToast({ type:"warn", text:`Espace insuffisant. Libérez ${packSize-deviceFree} Mo`}); }
              else { setDownloading(true); setDlProgress(0); }
            }} onCancel={()=> goToScene(2)} onBack={goBack} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

function Scene1({ onSeeMap, onMySpots, onOpenSettings, onOpenPicker }){
  return (
    <motion.section initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="relative min-h-[calc(100vh-0px)]">
      <div className="absolute top-3 right-3 z-20">
        <Button variant="ghost" size="icon" onClick={onOpenSettings} className={BTN_GHOST_ICON} aria-label="Réglages">
          <Menu className="w-7 h-7" />
        </Button>
      </div>

      <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1920&auto=format&fit=crop" alt="forêt brumeuse" className="absolute inset-0 w-full h-full object-cover"/>
      <div className="absolute inset-0 bg-black/60"/>
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="mx-auto mb-6 w-20 h-20 rounded-2xl bg-neutral-800/60 border border-neutral-700 grid place-items-center shadow-xl">
          <MushroomIcon className={T_PRIMARY} />
        </div>
        <h1 className={"text-3xl font-semibold "+T_PRIMARY}>Trouvez vos coins à champignons comestibles, même sans réseau.</h1>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={onSeeMap} className={BTN}>Voir la carte</Button>
          <Button onClick={onMySpots} className={BTN}>Mes coins</Button>
          <Button onClick={onOpenPicker} className={BTN}>Les champignons</Button>
        </div>
        <p className={"mt-8 text-sm "+T_MUTED}>Mini‑pack offline inclus : carte topo (50 km) + fiches Cèpe, Girolle, Morille.</p>
      </div>
    </motion.section>
  );
}

function Scene2({ onZone, onOpenShroom, gpsFollow, setGpsFollow, onBack }){
  const [selectedSpecies, setSelectedSpecies] = useState([]);
  const zones = useMemo(() => selectedSpecies.length===0 ? DEMO_ZONES : DEMO_ZONES.filter(z => selectedSpecies.every(id => (z.species[id]||0) > 50)), [selectedSpecies]);
  return (
    <motion.section initial={{ x:20, opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:-20, opacity:0 }} className="p-3">
      <div className="flex items-center gap-2 mb-3">
        <Button variant="ghost" size="icon" onClick={onBack} className={BTN_GHOST_ICON} aria-label="Retour">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="relative flex-1">
          <Input placeholder="Rechercher un lieu…" className={"pl-9 bg-neutral-900 border-neutral-800 "+T_PRIMARY}/>
          <Search className={"w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 "+T_MUTED} />
        </div>
        <Button onClick={()=> setGpsFollow(v=>!v)} className={BTN}><LocateFixed className="w-4 h-4 mr-2"/>GPS</Button>
      </div>

      <div className="relative h-[60vh] rounded-2xl border border-neutral-800 overflow-hidden">
        <iframe title="Carte" className="absolute inset-0 w-full h-full" src="https://www.openstreetmap.org/export/embed.html"></iframe>

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Button variant="ghost" size="icon" onClick={()=> setGpsFollow(true)} className={BTN_GHOST_ICON} aria-label="Ma position">📍</Button>
          <div className="bg-neutral-900/80 backdrop-blur rounded-xl p-2 border border-neutral-800 flex items-center gap-2">
            <span className={"text-xs "+T_PRIMARY}>Légende</span>
            {LEGEND.map((l,i)=> (
              <div key={i} className="flex items-center gap-1">
                <div className={classNames("w-3 h-3 rounded", l.color)} />
                <span className={"text-[10px] "+T_MUTED}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-3 left-3 grid gap-2">
          {zones.map(z=> (
            <div key={z.id} onClick={()=> onZone(z)} role="button" tabIndex={0} className={"bg-neutral-900/80 hover:bg-neutral-800/80 border border-neutral-800 rounded-xl px-3 py-2 text-left cursor-pointer"}>
              <div className="flex items-center justify-between">
                <div className={"font-medium "+T_PRIMARY}>{z.name}</div>
                <Badge variant={z.score>85?"default":"secondary"}>{z.score}%</Badge>
              </div>
              <div className={"text-xs "+T_MUTED}>{z.trend}</div>
              <div className="mt-1 flex gap-1">
                {Object.entries(z.species).map(([id, sc])=> (
                  <span key={id} onClick={(e)=>{ e.stopPropagation(); onOpenShroom(id); }} className={"text-[10px] bg-neutral-800 border border-neutral-700 px-2 py-1 rounded-full hover:bg-neutral-700 "+T_PRIMARY+" cursor-pointer"}>{MUSHROOMS.find(m=>m.id===id)?.name.split(" ")[0]} {sc}%</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {MUSHROOMS.map(m=> {
          const active = selectedSpecies.includes(m.id);
          return (
            <Button key={m.id} onClick={()=> setSelectedSpecies(s=> active?s.filter(x=>x!==m.id):[...s,m.id])} className={classNames(BTN, active?"":"opacity-60")}>{m.name}</Button>
          );
        })}
      </div>

      <p className={"text-xs mt-2 "+T_SUBTLE}>Hors ligne : affichage des zones optimales Cèpe, Girolle, Morille.</p>
    </motion.section>
  );
}

function Scene3({ zone, onGo, onAdd, onOpenShroom, onBack }){
  const data = useMemo(()=> generateForecast(), [zone?.id]);
  if(!zone) return <div className={"p-6 "+T_PRIMARY}>Sélectionnez une zone…</div>;
  return (
    <motion.section initial={{ x:20, opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:-20, opacity:0 }} className="p-3">
      <Button variant="ghost" size="icon" onClick={onBack} className={BTN_GHOST_ICON+" mb-3"} aria-label="Retour">
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Card className="bg-neutral-900 border-neutral-800 rounded-2xl">
        <CardHeader>
          <CardTitle className={"flex items-center justify-between "+T_PRIMARY}>
            <div>
              <div>{zone.name}</div>
              <div className={"text-xs "+T_MUTED}>{zone.coords?.join(", ")}</div>
            </div>
            <Badge>{zone.score}%</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top:10, right:10, bottom:0, left:0 }}>
                <XAxis dataKey="day" tick={{ fontSize:10, fill:"#d4d4d4" }} interval={3}/>
                <YAxis domain={[0,100]} tick={{ fontSize:10, fill:"#d4d4d4" }} width={28}/>
                <Tooltip contentStyle={{ background:"#171717", border:"1px solid #262626", borderRadius:12, color:"#e5e5e5" }}/>
                <ReferenceLine x={data[7].day} stroke="#525252" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="score" stroke="#e5e5e5" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className={"mt-2 text-xs "+T_SUBTLE}>Icônes météo (démo)</div>

          <div className="mt-4">
            <div className={"text-sm mb-2 "+T_PRIMARY}>Comestibles probables</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(zone.species).filter(([_,v])=>v>0).map(([id, sc])=>{
                const m = MUSHROOMS.find(m=>m.id===id);
                return (
                  <button key={id} onClick={()=> onOpenShroom(id)} className={"bg-neutral-800 border border-neutral-700 rounded-xl p-2 hover:bg-neutral-700 "+T_PRIMARY}>
                    <div className="flex items-center gap-2">
                      <img src={m.photo} className="w-12 h-12 object-cover rounded-lg"/>
                      <div>
                        <div className={"text-sm font-medium "+T_PRIMARY}>{m.name}</div>
                        <div className={"text-xs "+T_MUTED}>Score {sc}%</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Button onClick={onGo} className={BTN}><Route className="w-4 h-4 mr-2"/>Y aller</Button>
            <Button onClick={onAdd} className={BTN}><Plus className="w-4 h-4 mr-2"/>Ajouter à mes coins</Button>
          </div>
          <p className={"text-xs mt-2 "+T_SUBTLE}>Prévisions locales hors‑ligne (7 jours) disponibles pour 3 champignons inclus.</p>
        </CardContent>
      </Card>
    </motion.section>
  );
}

// ---------- SCÈNE 4 refaite selon demandes ----------
function Scene4({ onRoute, onBack }){
  const { state, dispatch } = useAppContext();
  const { mySpots } = state;
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [details, setDetails] = useState(null);
  const handleCreate = (spot: any) => dispatch({ type: 'ADD_SPOT', spot });
  const handleUpdate = (u: any) => dispatch({ type: 'UPDATE_SPOT', spot: u });

  return (
    <motion.section initial={{ x:20, opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:-20, opacity:0 }} className="p-3 space-y-3">
      {/* Titre centré milieu de la page */}
      <div className="relative h-10">
        <Button variant="ghost" size="icon" onClick={onBack} className={"absolute left-0 "+BTN_GHOST_ICON} aria-label="Retour">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h2 className={"absolute inset-0 grid place-items-center text-lg font-semibold "+T_PRIMARY}>Mes coins</h2>
      </div>

      {/* Le bouton Nouveau coin disparaît quand la popup est ouverte */}
      {!createOpen && (
        <div className="flex justify-end">
          <Button onClick={()=> setCreateOpen(true)} className={BTN}><Plus className="w-4 h-4 mr-2"/>Nouveau coin</Button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        {mySpots.length===0 && <div className={T_PRIMARY}>Aucun coin enregistré.</div>}
        {mySpots.map(s=> (
          <Card key={s.id} className="bg-neutral-900 border-neutral-800 rounded-2xl overflow-hidden relative">
            <button onClick={()=> setDetails(s)} className="block text-left">
              <img src={s.cover||s.photo} className="w-full h-40 object-cover"/>
            </button>
            {/* Icône de modification classique */}
            <button onClick={()=> setEditing(s)} className="absolute top-2 right-2 bg-neutral-900/80 hover:bg-neutral-800/80 border border-neutral-700 rounded-full p-2" aria-label="modifier">
              <Pencil className="w-4 h-4 text-neutral-200"/>
            </button>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={"font-medium "+T_PRIMARY}>{s.name}</div>
                <div className="flex items-center gap-1 text-amber-400">{"★".repeat(s.rating||0)}</div>
              </div>
              <div className={"text-xs "+T_MUTED}>Espèces : {(s.species||[]).join(", ")}</div>
              <div className={"text-xs "+T_MUTED}>Dernière visite : {s.last||"–"}</div>
              <div className="mt-3 flex gap-2">
                <Button onClick={onRoute} className={BTN}><Route className="w-4 h-4 mr-2"/>Itinéraire</Button>
                {/* bouton historique supprimé, clic sur la carte suffit */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className={"text-xs "+T_SUBTLE}>Données stockées localement. Accès hors‑ligne.</p>

      {/* Popup CRÉATION coin */}
      {createOpen && (
        <CreateSpotModal 
          onClose={()=> setCreateOpen(false)}
          onCreate={(spot)=>{ handleCreate(spot); setCreateOpen(false);} }
        />
      )}

      {/* Popup ÉDITION coin */}
      {editing && (
        <EditSpotModal 
          spot={editing}
          onClose={()=> setEditing(null)}
          onSave={(u)=>{ handleUpdate(u); setEditing(null); }}
        />
      )}

      {/* Popup DÉTAILS coin avec historique + galerie + lightbox */}
      {details && (
        <SpotDetailsModal spot={details} onClose={()=> setDetails(null)} />
      )}
    </motion.section>
  );
}

function StarRating({ value=0, onSelectIndex }){
  return (
    <div className="flex items-center select-none">
      {[0,1,2,3,4].map((i)=>{
        const filled = (5 - i) <= value;
        return (
          <button key={i} type="button" onClick={()=> onSelectIndex?.(i)} className="p-0.5" aria-label={`note ${5-i}`}>
            <span className={filled?"text-amber-400":"text-neutral-600"}>★</span>
          </button>
        );
      })}
    </div>
  );
}

// ---------- MODAL création nouveau coin ----------
function CreateSpotModal({ onClose, onCreate }){
  const today = new Date().toISOString().slice(0,10);
  const overlayRef = useRef(null);
  const [name, setName] = useState("Mon nouveau coin");
  const [species, setSpecies] = useState(["cepe"]);
  const [rating, setRating] = useState(4);
  const [last, setLast] = useState(today);
  const [location, setLocation] = useState("");
  const [photos, setPhotos] = useState([]); // multiples images

  const importImages = (e)=>{
    const files = Array.from(e.target.files||[]);
    if(files.length===0) return;
    const urls = files.map(f=> URL.createObjectURL(f));
    setPhotos(p=> [...p, ...urls]);
  };

  const handleOutside = (e)=>{ if(e.target===overlayRef.current) onClose(); };

  const create = ()=>{
    const cover = photos[0] || MUSHROOMS[0].photo;
    const history = [{ date:last, rating, note:"Création", photos: photos.slice(0,3) }];
    onCreate({ id:Date.now(), name, species, rating, last, location, cover, photos:photos.length?photos:[cover], history });
  };

  return (
    <div ref={overlayRef} onClick={handleOutside} className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-3">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={"text-lg font-semibold "+T_PRIMARY}>Nouveau coin</div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-100"><X className="w-5 h-5"/></button>
        </div>

        <div className="space-y-3">
          <Input value={name} onChange={e=> setName(e.target.value)} placeholder="Nom du coin" className={"bg-neutral-900 border-neutral-800 "+T_PRIMARY}/>
          <Input value={location} onChange={e=> setLocation(e.target.value)} placeholder="Localisation (coordonnées ou lieu)" className={"bg-neutral-900 border-neutral-800 "+T_PRIMARY}/>

          <div>
            <div className={"text-sm mb-1 "+T_PRIMARY}>Champignons trouvés</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {species.map(id=> (
                <span key={id} className="inline-flex items-center gap-1 bg-neutral-800 border border-neutral-700 rounded-full px-2 py-1 text-xs">
                  <span className={T_PRIMARY}>{MUSHROOMS.find(m=>m.id===id)?.name.split(" ")[0]}</span>
                  <button onClick={()=> setSpecies(list=> list.filter(x=>x!==id))} className="text-neutral-400 hover:text-neutral-200" aria-label="supprimer"><X className="w-3 h-3"/></button>
                </span>
              ))}
            </div>
            <select onChange={(e)=>{ const v=e.target.value; if(v) setSpecies(list=> list.includes(v)?list:[...list,v]); }} value="" className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100">
              <option value="" disabled>Ajouter un champignon…</option>
              {MUSHROOMS.filter(m=> !species.includes(m.id)).map(m=> (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Dernière visite avec date SOUS le label, pas de bouton "ajouter visite aujourd'hui" */}
          <div>
            <div className={"text-sm "+T_PRIMARY}>Dernière visite</div>
            <div className="mt-1">
              <input type="date" value={last} onChange={(e)=> setLast(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100"/>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={"text-sm "+T_MUTED}>Note</span>
            <StarRating value={rating} onSelectIndex={(i)=> setRating(5-i)} />
            <span className={"text-xs "+T_SUBTLE}>{rating}/5</span>
          </div>

          {/* Import MULTIPLE placé en bas de la popup */}
          <div className="pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <div className={"text-sm "+T_PRIMARY}>Photos</div>
              <label className="inline-flex items-center">
                <input type="file" accept="image/*" multiple className="hidden" onChange={importImages} />
                <Button type="button" className={BTN}><Images className="w-4 h-4 mr-2"/>Importer des photos</Button>
              </label>
            </div>
            {photos.length>0 && (
              <div className="grid grid-cols-4 gap-2">
                {photos.map((p,i)=> (
                  <img key={i} src={p} className="w-full h-20 object-cover rounded-lg border border-neutral-800"/>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 justify-end">
            <Button variant="ghost" onClick={onClose} className={"rounded-xl hover:bg-neutral-800 "+T_PRIMARY}>Annuler</Button>
            <Button className={BTN} onClick={create}>Créer</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- MODAL édition (sans bouton "ajouter visite aujourd'hui") ----------
function EditSpotModal({ spot, onClose, onSave }){
  const overlayRef = useRef(null);
  const [name, setName] = useState(spot.name);
  const [rating, setRating] = useState(spot.rating||3);
  const [species, setSpecies] = useState(spot.species||[]);
  const [last, setLast] = useState(spot.last||new Date().toISOString().slice(0,10));
  const [location, setLocation] = useState(spot.location||"");
  const [photos, setPhotos] = useState(spot.photos||[spot.cover].filter(Boolean));

  const importImages = (e)=>{
    const files = Array.from(e.target.files||[]);
    if(files.length===0) return;
    const urls = files.map(f=> URL.createObjectURL(f));
    setPhotos(p=> [...p, ...urls]);
  };
  const handleOutside = (e)=>{ if(e.target===overlayRef.current) onClose(); };

  return (
    <div ref={overlayRef} onClick={handleOutside} className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-3">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={"text-lg font-semibold "+T_PRIMARY}>Modifier le coin</div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-100"><X className="w-5 h-5"/></button>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Input value={name} onChange={e=> setName(e.target.value)} placeholder="Nom" className={"bg-neutral-900 border-neutral-800 "+T_PRIMARY}/>
            <Input value={location} onChange={e=> setLocation(e.target.value)} placeholder="Localisation" className={"bg-neutral-900 border-neutral-800 "+T_PRIMARY}/>
            <div className="flex items-center gap-2">
              <span className={"text-sm "+T_MUTED}>Note</span>
              <StarRating value={rating} onSelectIndex={(i)=> setRating(5-i)} />
              <span className={"text-xs "+T_SUBTLE}>{rating}/5</span>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <div className={"text-sm mb-1 "+T_PRIMARY}>Champignons trouvés</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {species.map(id=> (
                  <span key={id} className="inline-flex items-center gap-1 bg-neutral-800 border border-neutral-700 rounded-full px-2 py-1 text-xs">
                    <span className={T_PRIMARY}>{MUSHROOMS.find(m=>m.id===id)?.name.split(" ")[0]}</span>
                    <button onClick={()=> setSpecies(list=> list.filter(x=>x!==id))} className="text-neutral-400 hover:text-neutral-200" aria-label="supprimer"><X className="w-3 h-3"/></button>
                  </span>
                ))}
              </div>
              <select onChange={(e)=>{ const v=e.target.value; if(v) setSpecies(list=> list.includes(v)?list:[...list,v]); }} value="" className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100">
                <option value="" disabled>Ajouter un champignon…</option>
                {MUSHROOMS.filter(m=> !species.includes(m.id)).map(m=> (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <div className={"text-sm "+T_PRIMARY}>Dernière visite</div>
              <div className="mt-1">
                <input type="date" value={last} onChange={(e)=> setLast(e.target.value)} className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100"/>
              </div>
            </div>
          </div>
        </div>

        {/* Import multiple en bas de popup */}
        <div className="mt-3 pt-3 border-t border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <div className={"text-sm "+T_PRIMARY}>Photos</div>
            <label className="inline-flex items-center">
              <input type="file" accept="image/*" multiple className="hidden" onChange={importImages} />
              <Button type="button" className={BTN}><Images className="w-4 h-4 mr-2"/>Importer des photos</Button>
            </label>
          </div>
          {photos.length>0 && (
            <div className="grid grid-cols-4 gap-2">
              {photos.map((p,i)=> (
                <img key={i} src={p} className="w-full h-20 object-cover rounded-lg border border-neutral-800"/>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2 justify-end">
          <Button variant="ghost" onClick={onClose} className={"rounded-xl hover:bg-neutral-800 "+T_PRIMARY}>Annuler</Button>
          <Button className={BTN} onClick={()=> onSave({ ...spot, name, rating, species, last, location, cover:photos[0]||spot.cover, photos })}>Enregistrer</Button>
        </div>
      </div>
    </div>
  );
}

// ---------- MODAL détails avec historique + galerie + lightbox ----------
function SpotDetailsModal({ spot, onClose }){
  const overlayRef = useRef(null);
  const [lightbox, setLightbox] = useState({ open:false, index:0 });
  const photos = (spot.photos||[]);
  const [history, setHistory] = useState(spot.history || (spot.visits||[]).map((d)=> ({ date:d, rating:spot.rating, note:"", photos:[] })));

  const handleOutside = (e)=>{ if(e.target===overlayRef.current) onClose(); };
  const addVisit = ()=>{
    const today = new Date().toISOString().slice(0,10);
    setHistory(h=> [...h, { date:today, rating:0, note:"", photos:[] }]);
  };

  return (
    <div ref={overlayRef} onClick={handleOutside} className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-3">
      <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className={"text-lg font-semibold "+T_PRIMARY}>Historique du coin</div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-100"><X className="w-5 h-5"/></button>
        </div>

        {/* Carte placeholder */}
        <div className="relative h-48 rounded-xl overflow-hidden border border-neutral-800 bg-[conic-gradient(at_30%_30%,#14532d,#052e16,#14532d)]">
          <div className={"absolute top-2 left-2 px-2 py-1 rounded-lg text-xs bg-neutral-900/70 border border-neutral-800 "+T_PRIMARY}><MapPin className="w-3 h-3 inline mr-1"/>Carte du coin</div>
        </div>
        <p className={"text-xs mt-2 "+T_SUBTLE}>La carte affiche l'historique complet avec détails.</p>

        {/* Historique par date */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <div className={"text-sm "+T_PRIMARY}>Visites</div>
            <Button onClick={addVisit} className={BTN}><Plus className="w-4 h-4 mr-2"/>Ajouter une cueillette</Button>
          </div>
          <div className="space-y-2">
            {history.length===0 && <div className={T_MUTED}>Aucune visite enregistrée.</div>}
            {history.map((h,i)=> (
              <div key={i} className="flex items-start justify-between bg-neutral-900 border border-neutral-800 rounded-xl p-2">
                <div>
                  <div className={"text-sm "+T_PRIMARY}>{h.date}</div>
                  <div className={"text-xs "+T_MUTED}>Note: {h.rating??"–"}/5 {h.note?`• ${h.note}`:""}</div>
                </div>
                <div className="flex items-center gap-2">
                  {h.photos && h.photos.length>0 && (
                    <div className="flex -space-x-2">
                      {h.photos.slice(0,3).map((p,idx)=> (
                        <img key={idx} src={p} className="w-10 h-10 rounded-lg border border-neutral-800 object-cover"/>
                      ))}
                    </div>
                  )}
                  <Button variant="ghost" size="icon" className={BTN_GHOST_ICON} aria-label="modifier"><Pencil className="w-4 h-4"/></Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Galerie photos globale, bien agencée, premières visibles + compteur */}
        <div className="mt-3">
          <div className={"text-sm mb-2 "+T_PRIMARY}>Galerie</div>
          {photos.length===0 ? (
            <div className={T_MUTED}>Aucune photo.</div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {photos.slice(0,5).map((p,i)=> (
                <button key={i} onClick={()=> setLightbox({ open:true, index:i })} className="relative group">
                  <img src={p} className="w-full h-28 object-cover rounded-xl border border-neutral-800"/>
                  <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/20 transition"/>
                  <Maximize2 className="absolute right-2 bottom-2 w-4 h-4 text-white opacity-0 group-hover:opacity-100"/>
                </button>
              ))}
              {photos.length>5 && (
                <button onClick={()=> setLightbox({ open:true, index:5 })} className="relative grid place-items-center rounded-xl border border-neutral-800 bg-neutral-900/60">
                  <span className={"text-sm "+T_PRIMARY}>+{photos.length-5} photos</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox simple */}
      {lightbox.open && (
        <div onClick={()=> setLightbox({ open:false, index:0 })} className="fixed inset-0 z-50 bg-black/90 grid place-items-center p-3">
          <div className="relative w-full max-w-4xl">
            <img src={photos[lightbox.index]} className="w-full max-h-[80vh] object-contain rounded-xl"/>
            <div className="absolute inset-0 flex items-center justify-between px-2">
              <button onClick={(e)=>{e.stopPropagation(); setLightbox(s=> ({...s, index: Math.max(0, s.index-1)}));}} className="p-2 text-neutral-300">◀</button>
              <button onClick={(e)=>{e.stopPropagation(); setLightbox(s=> ({...s, index: Math.min(photos.length-1, s.index+1)}));}} className="p-2 text-neutral-300">▶</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Scene5({ onBackToMap, onBack }){
  return (
    <motion.section initial={{ x:20, opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:-20, opacity:0 }} className="p-3">
      <Button variant="ghost" size="icon" onClick={onBack} className={BTN_GHOST_ICON+" mb-3"} aria-label="Retour">
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <div className="relative h-[60vh] rounded-2xl border border-neutral-800 overflow-hidden bg-neutral-900 grid">
        <div className={"p-3 text-sm "+T_MUTED}>Instructions étape par étape (démo) : <br/>🚗 Rejoindre parking → 🚶 Sentier balisé → 🧭 Boussole sur 250 m</div>
        <div className="absolute top-3 right-3 flex gap-2">
          <Button className={BTN}>Marquer véhicule</Button>
          <Button onClick={onBackToMap} className={BTN}>Retour carte</Button>
        </div>
      </div>
      <p className={"text-xs mt-2 "+T_SUBTLE}>Navigation piéton/boussole disponible hors‑ligne si la zone est téléchargée.</p>
    </motion.section>
  );
}

function Scene6({ items, search, setSearch, onPick, onBack }){
  const [seasonFilter, setSeasonFilter] = useState("toutes");
  const [valueFilter, setValueFilter] = useState("toutes");
  return (
    <motion.section initial={{ x:20, opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:-20, opacity:0 }} className="p-3">
      <div className="grid md:grid-cols-4 gap-2 mb-3 items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className={BTN_GHOST_ICON} aria-label="Retour">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Input value={search} onChange={e=> setSearch(e.target.value)} placeholder="Rechercher un champignon…" className={"bg-neutral-900 border-neutral-800 "+T_PRIMARY}/>
        <select value={seasonFilter} onChange={e=> setSeasonFilter(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100">
          <option value="toutes">Toutes saisons</option>
          <option>Printemps</option>
          <option>Été</option>
          <option>Automne</option>
        </select>
        <select value={valueFilter} onChange={e=> setValueFilter(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100">
          <option value="toutes">Toute valeur</option>
          <option>Excellente</option>
          <option>Bonne</option>
          <option>Moyenne</option>
        </select>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {items.map(m=> (
          <button key={m.id} onClick={()=> onPick(m)} className="text-left bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700">
            <img src={m.photo} className="w-full h-40 object-cover"/>
            <div className="p-3">
              <div className={"font-medium "+T_PRIMARY}>{m.name}</div>
              <div className={"text-xs "+T_MUTED}>Saison : {m.season}</div>
            </div>
          </button>
        ))}
      </div>
      <p className={"text-xs mt-2 "+T_SUBTLE}>Hors‑ligne : Cèpe, Girolle et Morille apparaissent par défaut.</p>
    </motion.section>
  );
}

function Scene7({ item, onSeeZones, onBack }){
  if(!item) return <div className={"p-6 "+T_PRIMARY}>Sélectionnez un champignon…</div>;
  return (
    <motion.section initial={{ x:20, opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:-20, opacity:0 }} className="p-3">
      <Button variant="ghost" size="icon" onClick={onBack} className={BTN_GHOST_ICON+" mb-3"} aria-label="Retour">
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <div className="rounded-2xl overflow-hidden border border-neutral-800">
        <img src={item.photo} className="w-full h-60 object-cover"/>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <h2 className={"text-xl font-semibold "+T_PRIMARY}>{item.name}</h2>
        <Badge variant="secondary">{item.latin}</Badge>
        {item.edible ? <Badge className="bg-emerald-700">🍴 comestible</Badge> : <Badge className="bg-red-700">☠️ toxique</Badge>}
      </div>

      <div className="grid md:grid-cols-2 gap-3 mt-3">
        <InfoBlock icon={<Calendar className="w-4 h-4"/>} title="Saison" text={item.season} />
        <InfoBlock icon={<Trees className="w-4 h-4"/>} title="Habitat" text={item.habitat} />
        <InfoBlock icon={<CloudSun className="w-4 h-4"/>} title="Météo idéale" text={item.weatherIdeal} />
        <InfoBlock icon={<Info className="w-4 h-4"/>} title="Description rapide" text={item.description} />
        <InfoBlock icon={<ChefHat className="w-4 h-4"/>} title="Valeur culinaire + conseils" text={`${item.culinary}. ${item.cookingTips}`} />
        <InfoBlock icon={<Sandwich className="w-4 h-4"/>} title="Exemples de plats" text={item.dishes.join(" • ")} />
        <InfoBlock icon={<TriangleAlert className="w-4 h-4"/>} title="Confusions possibles" text={item.confusions.join(" • ")} />
        <InfoBlock icon={<Compass className="w-4 h-4"/>} title="Conseils cueillette" text={item.picking} />
      </div>

      {item.edible && (
        <div className="mt-4">
          <Button onClick={onSeeZones} className={BTN}><MapPin className="w-4 h-4 mr-2"/>Voir zones optimales</Button>
        </div>
      )}
      <p className={"text-xs mt-2 "+T_SUBTLE}>Fiche complète consultable hors‑ligne.</p>
    </motion.section>
  );
}

function InfoBlock({ icon, title, text }){
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3">
      <div className={"flex items-center gap-2 mb-1 "+T_PRIMARY}>
        <div className="w-6 h-6 grid place-items-center rounded-lg bg-neutral-800 text-neutral-100">{icon}</div>
        <div className="text-sm font-medium">{title}</div>
      </div>
      <div className={"text-sm "+T_MUTED}>{text}</div>
    </div>
  );
}

function Scene8({ onOpenPacks, onBack }){
  const { state, dispatch } = useAppContext();
  const { alerts, prefs } = state;
  return (
    <motion.section initial={{ x:20, opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:-20, opacity:0 }} className="p-3 space-y-3">
      <Button variant="ghost" size="icon" onClick={onBack} className={BTN_GHOST_ICON} aria-label="Retour">
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Card className="bg-neutral-900 border-neutral-800 rounded-2xl">
        <CardHeader><CardTitle className={T_PRIMARY}>Cartes hors‑ligne</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className={"font-medium "+T_PRIMARY}>Pack initial (50 km)</div>
              <div className={"text-xs "+T_MUTED}>Topo + Cèpe/Girolle/Morille</div>
            </div>
            <Button onClick={onOpenPacks} className={BTN}><Download className="w-4 h-4 mr-2"/>Télécharger une zone</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-800 rounded-2xl">
        <CardHeader><CardTitle className={T_PRIMARY}>Alertes</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <ToggleRow label="Optimum prévu" checked={alerts.optimum} onChange={v=> dispatch({ type:'SET_ALERTS', alerts:{ optimum:v }})} />
          <ToggleRow label="Nouvelle zone proche" checked={alerts.newZone} onChange={v=> dispatch({ type:'SET_ALERTS', alerts:{ newZone:v }})} />
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-800 rounded-2xl">
        <CardHeader><CardTitle className={T_PRIMARY}>Préférences</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <SelectRow label="Unités" value={prefs.units} options={["métriques","impériales"]} onChange={v=> dispatch({ type:'SET_PREFS', prefs:{ units:v }})} />
          <SelectRow label="Thème" value={prefs.theme} options={["auto","clair","sombre"]} onChange={v=> dispatch({ type:'SET_PREFS', prefs:{ theme:v }})} />
          <ToggleRow label="GPS" checked={prefs.gps} onChange={v=> dispatch({ type:'SET_PREFS', prefs:{ gps:v }})} />
        </CardContent>
      </Card>

      <div className={"text-sm "+T_MUTED}>« À propos » • « Conseils de cueillette »</div>
    </motion.section>
  );
}

function ToggleRow({ label, checked, onChange }){
  return (
    <div className="flex items-center justify-between">
      <div className={T_PRIMARY}>{label}</div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function SelectRow({ label, value, options, onChange }){
  return (
    <div className="flex items-center justify-between gap-3">
      <div className={T_PRIMARY}>{label}</div>
      <select value={value} onChange={e=> onChange(e.target.value)} className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100">
        {options.map(o=> <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Scene9({ packSize, setPackSize, deviceFree, setDeviceFree, includeRelief, setIncludeRelief, includeWeather, setIncludeWeather, downloading, dlProgress, onStart, onCancel, onBack }){
  useEffect(()=>{
    const base = 120;
    const size = base + (includeRelief?30:0) + (includeWeather?30:0);
    setPackSize(size);
  }, [includeRelief, includeWeather, setPackSize]);

  return (
    <motion.section initial={{ x:20, opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:-20, opacity:0 }} className="p-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Input placeholder="Rechercher une zone…" className={"pl-9 bg-neutral-900 border-neutral-800 "+T_PRIMARY}/>
          <Search className={"w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 "+T_MUTED} />
        </div>
        <Button variant="ghost" size="icon" onClick={onBack} className={BTN_GHOST_ICON} aria-label="Retour">
          <ChevronLeft className="w-5 h-5" />
        </Button>
      </div>
      <div className="relative h-[50vh] rounded-2xl border border-neutral-800 overflow-hidden bg-[conic-gradient(at_30%_30%,#14532d,#052e16,#14532d)]">
        <div className="absolute inset-6 border-2 border-red-600 rounded-xl"/>
        <div className={"absolute top-3 left-3 bg-neutral-900/80 rounded-xl px-3 py-1 text-sm "+T_PRIMARY}>Vue actuelle</div>
      </div>

      <div className="mt-3 grid md:grid-cols-2 gap-3">
        <Card className="bg-neutral-900 border-neutral-800 rounded-2xl">
          <CardContent className="pt-4 space-y-2">
            <Row label="Taille estimée" value={`${packSize} Mo`} />
            <Row label="Espace disponible" value={`${deviceFree} Mo`} />
            <Row label="Temps estimé" value="~ 45 s" />
            <div className="flex items-center justify-between">
              <div className={"text-sm "+T_PRIMARY}>Inclure relief / altitudes</div>
              <Switch checked={includeRelief} onCheckedChange={setIncludeRelief} />
            </div>
            <div className="flex items-center justify-between">
              <div className={"text-sm "+T_PRIMARY}>Inclure prévisions météo locales</div>
              <Switch checked={includeWeather} onCheckedChange={setIncludeWeather} />
            </div>
            {!downloading ? (
              <div className="flex gap-2">
                <Button onClick={onStart} className={BTN + " flex-1"}><Download className="w-4 h-4 mr-2"/>Télécharger</Button>
                <Button variant="ghost" onClick={onCancel} className={"flex-1 rounded-xl hover:bg-neutral-800 "+T_PRIMARY}>Annuler</Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Progress value={dlProgress} />
                <div className={"text-xs "+T_MUTED}>{Math.round(dlProgress)}%</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-neutral-900 border-neutral-800 rounded-2xl">
          <CardHeader><CardTitle className={T_PRIMARY}>États possibles</CardTitle></CardHeader>
          <CardContent className={"text-sm "+T_MUTED+" space-y-1"}>
            <div>• Succès → « Carte téléchargée et prête hors‑ligne »</div>
            <div>• Échec réseau → « Téléchargement interrompu – reprendra automatiquement »</div>
            <div>• Manque d'espace → « Espace insuffisant. Libérez n Mo »</div>
            <div className={"text-xs "+T_SUBTLE}>Les cartes incluent les données des 3 champignons par défaut.</div>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
}

function Row({ label, value }){
  return (
    <div className="flex items-center justify-between">
      <div className={"text-sm "+T_PRIMARY}>{label}</div>
      <div className={"text-sm "+T_MUTED}>{value}</div>
    </div>
  );
}



