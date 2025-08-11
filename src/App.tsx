import React, { useMemo, useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { classNames, todayISO } from "./utils";
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
import PrivacyPolicyScene from "./scenes/PrivacyPolicyScene";
import { AppProvider, useAppContext } from "./context/AppContext";
import { useT } from "./i18n";
import { Scene } from "./routes";

export default function MycoExplorerApp() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
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
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = useCallback((s: Scene) => navigate(s), [navigate]);
  const goBack = useCallback(() => navigate(-1), [navigate]);

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
              goTo(Scene.Map);
            }, 500);
          }
          return next;
        });
      }, 500);
      return () => clearInterval(id);
    }
  }, [downloading, goTo]);

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

  useEffect(() => {
    if (toast) {
      const id = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(id);
    }
  }, [toast]);

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
        >
          {toast.text}
        </div>
      )}

      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path={Scene.Landing}
              element={
                <LandingScene
                  onSeeMap={() => goTo(Scene.Map)}
                  onMySpots={() => goTo(Scene.Spots)}
                  onOpenSettings={() => goTo(Scene.Settings)}
                  onOpenPicker={() => goTo(Scene.Picker)}
                />
              }
            />
            <Route
              path={Scene.Map}
              element={
                <MapScene
                  onBack={goBack}
                  gpsFollow={gpsFollow}
                  setGpsFollow={setGpsFollow}
                  onZone={(z) => {
                    setSelectedZone(z);
                    goTo(Scene.Zone);
                  }}
                  onOpenShroom={(id) => {
                    setSelectedMushroom(MUSHROOMS.find((m) => m.id === id) || null);
                    goTo(Scene.Mushroom);
                  }}
                />
              }
            />
            <Route
              path={Scene.Zone}
              element={
                <ZoneScene
                  zone={selectedZone}
                  onGo={() => goTo(Scene.Route)}
                  onAdd={() => {
                    const today = todayISO();
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
                    goTo(Scene.Mushroom);
                  }}
                  onBack={goBack}
                />
              }
            />
            <Route
              path={Scene.Spots}
              element={<SpotsScene onRoute={() => goTo(Scene.Route)} onBack={goBack} />}
            />
            <Route
              path={Scene.Route}
              element={<RouteScene onBackToMap={() => goTo(Scene.Map)} onBack={goBack} />}
            />
            <Route
              path={Scene.Picker}
              element={
                <PickerScene
                  items={filteredMushrooms}
                  search={search}
                  setSearch={setSearch}
                  onPick={(m) => {
                    setSelectedMushroom(m);
                    goTo(Scene.Mushroom);
                  }}
                  onBack={goBack}
                />
              }
            />
            <Route
              path={Scene.Mushroom}
              element={<MushroomScene item={selectedMushroom} onSeeZones={() => goTo(Scene.Map)} onBack={goBack} />}
            />
            <Route
              path={Scene.Settings}
              element={
                <SettingsScene
                  onOpenPacks={() => goTo(Scene.Download)}
                  onOpenPrivacy={() => goTo(Scene.Privacy)}
                  onBack={goBack}
                />
              }
            />
            <Route
              path={Scene.Download}
              element={
                <DownloadScene
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
                  onCancel={() => goTo(Scene.Map)}
                  onBack={goBack}
                />
              }
            />
            <Route
              path={Scene.Privacy}
              element={<PrivacyPolicyScene onBack={goBack} />}
            />
            <Route path="*" element={<Navigate to={Scene.Landing} replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}
