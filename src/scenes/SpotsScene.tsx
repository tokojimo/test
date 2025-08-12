import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Plus, Route, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BTN, BTN_GHOST_ICON, T_PRIMARY, T_MUTED, T_SUBTLE } from "../styles/tokens";
import { CreateSpotModal } from "../components/CreateSpotModal";
import { SpotDetailsModal } from "../components/SpotDetailsModal";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { useAppContext } from "../context/AppContext";
import { useT } from "../i18n";
import { getStaticMapUrl } from "../services/openstreetmap";
import Logo from "@/assets/logo.png";
import type { Spot } from "../types";

export default function SpotsScene({ onBack }: { onBack: () => void }) {
  const { state, dispatch } = useAppContext();
  const spots = state.mySpots;
  const [createOpen, setCreateOpen] = useState(false);
  const [details, setDetails] = useState<Spot | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { t } = useT();

  const openRoute = (spot: Spot) => {
    if (!spot.location) return;
    const [lat, lng] = spot.location.split(",").map(v => parseFloat(v.trim()));
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.section initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="p-3 space-y-3">
      <div className="relative h-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className={`absolute left-0 ${BTN_GHOST_ICON}`}
          aria-label={t("Retour")}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h2 className={`absolute inset-0 grid place-items-center text-lg font-semibold pointer-events-none ${T_PRIMARY}`}>
          {t("Mes coins")}
        </h2>
      </div>

      {!createOpen && (
        <div className="flex justify-end">
          <Button onClick={() => setCreateOpen(true)} className={BTN}>
            <Plus className="w-4 h-4 mr-2" />
            {t("Nouveau coin")}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-secondary dark:bg-secondary border border-secondary dark:border-secondary rounded-2xl overflow-hidden">
              <Skeleton className="w-full h-40" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </CardContent>
            </Card>
          ))}
        {!loading && spots.length === 0 && <div className={T_PRIMARY}>{t("Aucun coin enregistré.")}</div>}
        {!loading &&
          spots.map(s => {
            const [lat, lng] = s.location ? s.location.split(",").map(v => parseFloat(v.trim())) : [NaN, NaN];
            const hasLoc = !Number.isNaN(lat) && !Number.isNaN(lng);
            const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
            const mapUrl = hasLoc
              ? getStaticMapUrl(lat, lng, 400 * dpr, 160 * dpr)
              : s.cover || s.photos?.[0];
            return (
              <Card
                key={s.id}
                onClick={() => setDetails(s)}
                className="cursor-pointer bg-secondary dark:bg-secondary border border-secondary dark:border-secondary rounded-2xl overflow-hidden relative"
              >
                {hasLoc ? (
                  <div className="relative w-full h-40">
                    <img src={mapUrl as string} className="w-full h-full object-cover" />
                    <img src={Logo} className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                ) : (
                  <img src={mapUrl as string} className="w-full h-40 object-cover" />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteId(s.id);
                  }}
                  className="absolute top-2 right-2 bg-secondary/80 hover:bg-secondary/80 dark:bg-secondary/80 dark:hover:bg-secondary/80 border border-secondary dark:border-secondary rounded-full p-2"
                  aria-label={t("supprimer")}
                >
                  <X className="w-4 h-4 text-secondary" />
                </button>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className={`font-medium ${T_PRIMARY}`}>{s.name}</div>
                    <div className="flex items-center gap-1 text-amber-400">{"★".repeat(s.rating || 0)}</div>
                  </div>
                  <div className={`text-xs ${T_MUTED}`}>
                    {t("Espèces :")} {(s.species || []).join(", ")}
                  </div>
                  <div className={`text-xs ${T_MUTED}`}>
                    {t("Dernière visite :")} {s.last || "–"}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        openRoute(s);
                      }}
                      className={BTN}
                    >
                      <Route className="w-4 h-4 mr-2" />
                      {t("Itinéraire")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
      <p className={`text-xs ${T_SUBTLE}`}>{t("Données stockées localement. Accès hors‑ligne.")}</p>

      {createOpen && (
        <CreateSpotModal
          onClose={() => setCreateOpen(false)}
          onCreate={(spot) => {
            dispatch({ type: "addSpot", spot });
            setCreateOpen(false);
          }}
        />
      )}

      {details && (
        <SpotDetailsModal spot={details} onClose={() => setDetails(null)} />
      )}

      <ConfirmDeleteModal
        open={deleteId !== null}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) dispatch({ type: "removeSpot", id: deleteId });
          setDeleteId(null);
        }}
      />
    </motion.section>
  );
}
