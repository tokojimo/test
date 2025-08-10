import React, { useMemo, useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { classNames } from "./utils";
import { T_PRIMARY } from "./styles/tokens";
import type { Mushroom, Zone, Spot } from "./types";
import { MUSHROOMS } from "./data/mushrooms";
import LandingScene from "./scenes/LandingScene";
import MapScene from "./scenes/MapScene";
import ZoneScene from "./scenes/ZoneScene";
import SpotsScene from "./scenes/SpotsScene";
import RouteScene from "./scenes/RouteScene";
import PickerScene from "./scenes/PickerScene";
import MushroomScene from "./scenes/MushroomScene";
import SettingsScene from "./scenes/SettingsScene";
import DownloadScene from "./scenes/DownloadScene";
import { AppProvider, useAppContext } from "./context/AppContext";
import DaySlider from "./components/DaySlider";
import { useT } from "./i18n";

export default function MycoExplorerApp() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  const [scene, setScene] = useState<number>(1);
  const [history, setHistory] = useState<number[]>([1]);
  const [search, setSearch] = useState("");
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedMushroom, setSelectedMushroom] = useState<Mushroom | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [dlProgress, setDlProgress] = useState(0);
  const [includeRelief, setIncludeRelief] = useState(true);
  const [includeWeather, setIncludeWeather] = useState(true);
  const [packSize, setPackSize] = useState(180);
  const [deviceFree, setDeviceFree] = useState(2048);
  const [toast, setToast] = useState<{ type: "success" | "warn"; text: string } | null>(null);
  const [gpsFollow, setGpsFollow] = useState(false);

  const { state, dispatch } = useAppContext();
  const { t } = useT();

  const goToScene = useCallback((next: number) => {
    setScene(next);
    setHistory((h) => [...h, next]);
  }, []);

  const goBack = useCallback(() => {
    setHistory((h) => {
      if (h.length <= 1) return h;
      const newHistory = h.slice(0, -1);
      setScene(newHistory[newHistory.length - 1]);
      return newHistory;
    });
  }, []);

  useEffect(() => {
    if (downloading) {
      const id = setInterval(() => {
        setDlProgress((p) => {
          const next = Math.min(100, p + Math.random() * 15);
          if (next >= 100) {
            clearInterval(id);
            setTimeout(() => {
              setDownloading(false);
              setToast({ type: "success", text: t("Carte téléchargée et prête hors‑ligne") });
              goToScene(2);
            }, 500);
          }
          return next;
        });
      }, 500);
      return () => clearInterval(id);
    }
  }, [downloading, goToScene]);

  useEffect(() => {
    const theme = state.prefs.theme;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const isDark = theme === "sombre" || (theme === "auto" && media.matches);
      document.documentElement.classList.toggle("dark", isDark);
    };
    applyTheme();
    media.addEventListener("change", applyTheme);
    return () => media.removeEventListener("change", applyTheme);
  }, [state.prefs.theme]);

  const filteredMushrooms = useMemo(
    () => MUSHROOMS.filter((m) => m.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {toast && (
        <div
          className={classNames(
            "fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-xl px-4 py-2 shadow-xl",
            toast.type === "success" ? "bg-emerald-600 " + T_PRIMARY : "bg-amber-600 " + T_PRIMARY
          )}
          onAnimationEnd={() => setTimeout(() => setToast(null), 2500)}
        >
          {toast.text}
        </div>
      )}

      <main>
        <DaySlider />
        <AnimatePresence mode="wait">
          {scene === 1 && <LandingScene key="s1" onSeeMap={() => goToScene(2)} onMySpots={() => goToScene(4)} onOpenSettings={() => goToScene(8)} onOpenPicker={() => goToScene(6)} />}
          {scene === 2 && <MapScene key="s2" onBack={goBack} gpsFollow={gpsFollow} setGpsFollow={setGpsFollow} onZone={(z) => { setSelectedZone(z); goToScene(3); }} onOpenShroom={(id) => { setSelectedMushroom(MUSHROOMS.find((m) => m.id === id) || null); goToScene(7); }} />}
            {scene === 3 && (
              <ZoneScene
                key="s3"
                zone={selectedZone}
                onGo={() => goToScene(5)}
                onAdd={() => {
                  const today = new Date().toISOString().slice(0, 10);
                  dispatch({
                    type: "addSpot",
                    spot: {
                      id: Date.now(),
                      cover: MUSHROOMS[1].photo,
                      photos: [MUSHROOMS[1].photo],
                      name: selectedZone?.name,
                      species: Object.keys(selectedZone?.species || {}),
                      rating: 5,
                      last: today,
                      history: [
                        { date: today, rating: 5, note: t("Créé"), photos: [MUSHROOMS[1].photo] },
                      ],
                    } as Spot,
                  });
                  setToast({ type: "success", text: t("Coin ajouté") });
                }}
                onOpenShroom={(id) => {
                  setSelectedMushroom(
                    MUSHROOMS.find((m) => m.id === id) || null
                  );
                  goToScene(7);
                }}
                onBack={goBack}
              />
            )}
            {scene === 4 && <SpotsScene key="s4" onRoute={() => goToScene(5)} onBack={goBack} />}
          {scene === 5 && <RouteScene key="s5" onBackToMap={() => goToScene(2)} onBack={goBack} />}
          {scene === 6 && <PickerScene key="s6" items={filteredMushrooms} search={search} setSearch={setSearch} onPick={(m) => { setSelectedMushroom(m); goToScene(7); }} onBack={goBack} />}
          {scene === 7 && <MushroomScene key="s7" item={selectedMushroom} onSeeZones={() => goToScene(2)} onBack={goBack} />}
            {scene === 8 && <SettingsScene key="s8" onOpenPacks={() => goToScene(9)} onBack={goBack} />}
          {scene === 9 && (
            <DownloadScene
              key="s9"
              packSize={packSize}
              setPackSize={setPackSize}
              deviceFree={deviceFree}
              setDeviceFree={setDeviceFree}
              includeRelief={includeRelief}
              setIncludeRelief={setIncludeRelief}
              includeWeather={includeWeather}
              setIncludeWeather={setIncludeWeather}
              downloading={downloading}
              dlProgress={dlProgress}
              onStart={() => {
                if (packSize > deviceFree) {
                  setToast({
                    type: "warn",
                    text: t("Espace insuffisant. Libérez {n} Mo", { n: packSize - deviceFree }),
                  });
                } else {
                  setDownloading(true);
                  setDlProgress(0);
                }
              }}
              onCancel={() => goToScene(2)}
              onBack={goBack}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
