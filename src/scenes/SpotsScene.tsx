import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Loader2, Plus, Route, Send, Share2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BTN, BTN_GHOST_ICON, T_PRIMARY, T_MUTED, T_SUBTLE } from "../styles/tokens";
import { CreateSpotModal } from "../components/CreateSpotModal";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { useAppContext } from "../context/AppContext";
import { useT } from "../i18n";
import { getStaticMapUrl } from "../services/staticMap";
import { formatDate } from "../utils";
import Logo from "@/assets/logo.png";
import { MUSHROOMS } from "../data/mushrooms";
import type { Spot } from "../types";
import { createKmzFromSpots } from "@/utils/kmz";

export default function SpotsScene({ onBack, onOpenSpot }: { onBack: () => void; onOpenSpot: (s: Spot) => void }) {
  const { state, dispatch } = useAppContext();
  const spots = state.mySpots;
  const [createOpen, setCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [mapUrls, setMapUrls] = useState<Record<number, string>>({});
  const [shareMode, setShareMode] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const { t } = useT();
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

  const selectedCount = selectedIds.size;
  const hasSpots = spots.length > 0;

  const toggleSelection = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const resetShare = () => {
    setShareMode(false);
    setSelectedIds(new Set());
    setSharing(false);
  };

  useEffect(() => {
    if (!hasSpots && shareMode) {
      resetShare();
    }
  }, [hasSpots, shareMode]);

  const handleShare = async () => {
    if (selectedCount === 0) {
      alert(t("Sélectionnez au moins un coin à partager."));
      return;
    }

    const chosen = spots.filter(spot => selectedIds.has(spot.id));
    if (chosen.length === 0) {
      alert(t("Sélectionnez au moins un coin à partager."));
      return;
    }

    setSharing(true);
    try {
      const timestamp = new Date();
      const filename = `spots-${timestamp.toISOString().replace(/[:.]/g, "-")}.kmz`;
      const kmzFile = await createKmzFromSpots(chosen, {
        documentName: t("Mes coins"),
        fileName: filename,
      });

      const shareText = t("Export de {count} coins.", { count: chosen.length });
      let file: Blob | File = kmzFile;
      if (typeof File !== "undefined") {
        file = kmzFile instanceof File ? kmzFile : new File([kmzFile], filename, { type: "application/vnd.google-earth.kmz" });
      }

      const nav = typeof navigator !== "undefined" ? navigator : undefined;
      const hasShare = typeof nav?.share === "function";
      const canShareFiles =
        file instanceof File && (!nav?.canShare || (typeof nav.canShare === "function" && nav.canShare({ files: [file] })));

      if (hasShare) {
        const shareData: ShareData = {
          title: t("Mes coins"),
          text: shareText,
        };

        if (canShareFiles && file instanceof File) {
          shareData.files = [file];
        }

        try {
          await nav.share(shareData);
          resetShare();
          return;
        } catch (err) {
          console.warn("Native share failed, falling back to download", err);
        }
      }

      if (typeof window !== "undefined") {
        const blobUrl = URL.createObjectURL(file);
        try {
          if (typeof document !== "undefined") {
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = file instanceof File ? file.name : filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }

          const fallbackText = `${shareText}\n${t("Téléchargez le fichier ici :")} ${blobUrl}`;
          const encoded = encodeURIComponent(fallbackText);

          const promptAndOpen = (messageKey: string, url: string) => {
            if (window.confirm(t(messageKey))) {
              window.open(url, "_blank", "noopener,noreferrer");
            }
          };

          promptAndOpen(
            "Ouvrir votre application email pour partager ?",
            `mailto:?subject=${encodeURIComponent(t("Mes coins"))}&body=${encoded}`,
          );
          promptAndOpen("Ouvrir WhatsApp pour partager ?", `https://api.whatsapp.com/send?text=${encoded}`);
          promptAndOpen(
            "Ouvrir Messenger pour partager ?",
            `https://www.messenger.com/share?link=${encodeURIComponent(blobUrl)}`,
          );
          alert(t("Le fichier KMZ a été téléchargé. Si aucune application ne s'est ouverte, partagez-le manuellement."));
        } finally {
          setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
          }, 10000);
        }
      }

      resetShare();
    } catch (error) {
      console.error(error);
      alert(t("Impossible de partager ces coins pour le moment."));
    } finally {
      setSharing(false);
    }
  };

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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        spots.map(async (s) => {
          const [lat, lng] = s.location
            ? s.location.split(",").map((v) => parseFloat(v.trim()))
            : [NaN, NaN];
          if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
            const url = await getStaticMapUrl(lat, lng, 400 * dpr, 160 * dpr);
            return [s.id, url] as [number, string];
          }
          return [s.id, s.cover || s.photos?.[0] || ""] as [number, string];
        })
      );
      if (!cancelled) {
        const obj: Record<number, string> = {};
        for (const [id, url] of entries) obj[id] = url;
        setMapUrls(obj);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [spots, dpr]);

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
        <div className="flex justify-end gap-2">
          {shareMode ? (
            <>
              <Button
                onClick={handleShare}
                disabled={sharing || selectedCount === 0}
                className={BTN}
              >
                {sharing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                {t("Envoyer")}
              </Button>
              <Button
                variant="ghost"
                onClick={resetShare}
                className={BTN}
                aria-label={t("Annuler le partage")}
              >
                <X className="w-4 h-4 mr-2" />
                {t("Annuler")}
              </Button>
            </>
          ) : (
            <>
              {hasSpots && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setShareMode(true);
                    setSelectedIds(new Set());
                  }}
                  className={BTN}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {t("Partager")}
                </Button>
              )}
              <Button onClick={() => setCreateOpen(true)} className={BTN}>
                <Plus className="w-4 h-4 mr-2" />
                {t("Nouveau coin")}
              </Button>
            </>
          )}
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
            const mapUrl = mapUrls[s.id] || s.cover || s.photos?.[0];
            const isSelected = selectedIds.has(s.id);
            const cardClasses = `${
              shareMode && isSelected ? "ring-2 ring-primary" : ""
            } cursor-pointer bg-secondary dark:bg-secondary border border-secondary dark:border-secondary rounded-2xl overflow-hidden relative`;
            return (
              <Card
                key={s.id}
                onClick={() => {
                  if (shareMode) {
                    toggleSelection(s.id);
                  } else {
                    onOpenSpot(s);
                  }
                }}
                className={cardClasses}
              >
                {shareMode && (
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      toggleSelection(s.id);
                    }}
                    aria-pressed={isSelected}
                    aria-label={isSelected ? t("Retirer de la sélection") : t("Ajouter à la sélection")}
                    className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                  >
                    <span
                      className={`flex h-full w-full items-center justify-center rounded-full border-2 backdrop-blur-sm shadow transition-all ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-primary/70 bg-background/90 text-transparent"
                      }`}
                    >
                      <Check className="h-4 w-4" />
                    </span>
                  </button>
                )}
                {hasLoc ? (
                  <div className="relative w-full h-40">
                    <img src={mapUrl as string} className="w-full h-full object-cover" />
                    <img src={Logo} className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full" />
                  </div>
                ) : (
                  <img src={mapUrl as string} className="w-full h-40 object-cover" />
                )}
                {!shareMode && (
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
                )}
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className={`font-medium ${T_PRIMARY}`}>{s.name}</div>
                    {(() => {
                      const avg = s.history?.length
                        ? Math.floor(s.history.reduce((sum, h) => sum + (h.rating || 0), 0) / s.history.length)
                        : s.rating || 0;
                      return <div className="flex items-center gap-1 text-gold">{"★".repeat(avg)}</div>;
                    })()}
                  </div>
                  <div className={`text-xs ${T_MUTED}`}>
                    {t("Espèces :")} {(s.species || [])
                      .map(id => MUSHROOMS.find(m => m.id === id)?.name || id.replace(/_/g, " "))
                      .join(", ")}
                  </div>
                  <div className={`text-xs ${T_MUTED}`}>
                    {t("Dernière cueillette :")} {s.last ? formatDate(s.last) : "–"}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!shareMode) {
                          openRoute(s);
                        }
                      }}
                      className={BTN}
                      disabled={shareMode}
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
