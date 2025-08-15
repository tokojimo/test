import React, { useMemo, useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { classNames, todayISO } from "./utils";
import { T_PRIMARY } from "./styles/tokens";
import type { Mushroom, Zone, Spot } from "./types";
import { MUSHROOMS } from "./data/mushrooms";
import { getStaticMapUrl } from "./services/staticMap";
import LandingScene from "./scenes/LandingScene";
import MapScene from "./scenes/MapScene";
import ZoneScene from "./scenes/ZoneScene";
import SpotsScene from "./scenes/SpotsScene";
import SpotDetailsScene from "./scenes/SpotDetailsScene";
import PickerScene from "./scenes/PickerScene";
import MushroomScene from "./scenes/MushroomScene";
import SettingsIndex from "./routes/settings";
import DownloadScene from "./scenes/DownloadScene";
import PrivacyPolicyScene from "./scenes/PrivacyPolicyScene";
import TermsScene from "./scenes/TermsScene";
import LoginScene from "./scenes/LoginScene";
import SignupScene from "./scenes/SignupScene";
import PremiumScene from "./scenes/PremiumScene";
import { AppProvider, useAppContext } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/settings/Toasts";
import { useT } from "./i18n";
import { Scene } from "./routes";
import Callback from "./routes/auth/Callback";

export default function MycoExplorerApp() {
  return (
    <AuthProvider>
      <AppProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AppProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const [search, setSearch] = useState("");
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedMushroom, setSelectedMushroom] = useState<Mushroom | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [dlProgress, setDlProgress] = useState(0);
  const [includeRelief, setIncludeRelief] = useState(true);
  const [includeWeather, setIncludeWeather] = useState(true);
  const [packSize, setPackSize] = useState(180);
  const [deviceFree, setDeviceFree] = useState(2048);
  type Toast = { id: number; type: "success" | "warn"; text: string };
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [gpsFollow, setGpsFollow] = useState(true);

  const { dispatch } = useAppContext();
  const { t } = useT();
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = useCallback((s: Scene) => navigate(s), [navigate]);
  const goBack = useCallback(() => navigate(-1), [navigate]);

  const pushToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((curr) => {
      const next = [{ id, ...toast }, ...curr];
      return next.slice(0, 3);
    });
    setTimeout(() => {
      setToasts((curr) => curr.filter((t) => t.id !== id));
    }, 5000);
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
              pushToast({ type: "success", text: t("Carte téléchargée et prête hors‑ligne") });
              goTo(Scene.Map);
            }, 500);
          }
          return next;
        });
      }, 500);
      return () => clearInterval(id);
    }
  }, [downloading, goTo, pushToast, t]);


  const filteredMushrooms = useMemo(
    () => MUSHROOMS.filter((m) => m.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={classNames(
              "rounded-xl px-4 py-2 shadow-xl",
              toast.type === "success" ? "bg-emerald-600 " + T_PRIMARY : "bg-amber-600 " + T_PRIMARY
            )}
          >
            {toast.text}
          </div>
        ))}
      </div>

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
                />
              }
            />
            <Route
              path={Scene.Zone}
              element={
                <ZoneScene
                  zone={selectedZone}
                  onAdd={async () => {
                    const today = todayISO();
                    const cover = selectedZone?.coords
                      ? await getStaticMapUrl(
                          selectedZone.coords[0],
                          selectedZone.coords[1],
                          400,
                          160,
                          13
                        )
                      : MUSHROOMS[1].photo;
                    const location = selectedZone?.coords?.join(",");
                    dispatch({
                      type: "addSpot",
                      spot: {
                        id: Date.now(),
                        cover,
                        photos: [cover],
                        name: selectedZone?.name,
                        species: Object.keys(selectedZone?.species || {}),
                        rating: 5,
                        last: today,
                        location,
                        history: [
                          {
                            id: crypto.randomUUID(),
                            date: today,
                            rating: 5,
                            note: t("Créé"),
                            photos: [cover],
                          },
                        ],
                      } as Spot,
                    });
                    pushToast({ type: "success", text: t("Coin ajouté") });
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
              element={
                <SpotsScene
                  onBack={goBack}
                  onOpenSpot={(s) => {
                    setSelectedSpot(s);
                    goTo(Scene.Spot);
                  }}
                />
              }
            />
            <Route
              path={Scene.Spot}
              element={<SpotDetailsScene spot={selectedSpot} onBack={goBack} />}
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
            <Route path={Scene.Settings} element={<SettingsIndex />} />
            <Route path={Scene.AuthCallback} element={<Callback />} />
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
                      pushToast({
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
            <Route
              path={Scene.Terms}
              element={<TermsScene onBack={goBack} />}
            />
            <Route
              path={Scene.Login}
              element={
                <LoginScene
                  onSignup={() => goTo(Scene.Signup)}
                  onPremium={() => goTo(Scene.Premium)}
                  onBack={goBack}
                />
              }
            />
            <Route
              path={Scene.Signup}
              element={<SignupScene onLogin={() => goTo(Scene.Login)} onBack={goBack} />}
            />
            <Route
              path={Scene.Premium}
              element={<PremiumScene onBack={goBack} />}
            />
            <Route path="*" element={<Navigate to={Scene.Landing} replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}
