import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Plus, Pencil, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BTN, BTN_GHOST_ICON, T_PRIMARY, T_MUTED, T_SUBTLE } from "../styles/tokens";
import { CreateSpotModal } from "../components/CreateSpotModal";
import { EditSpotModal } from "../components/EditSpotModal";
import { SpotDetailsModal } from "../components/SpotDetailsModal";
import { useAppContext } from "../context/AppContext";
import { useT } from "../i18n";

export default function SpotsScene({ onRoute, onBack }: { onRoute: () => void; onBack: () => void }) {
  const { state, dispatch } = useAppContext();
  const spots = state.mySpots;
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [details, setDetails] = useState<any>(null);
  const { t } = useT();

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
        <h2 className={`absolute inset-0 grid place-items-center text-lg font-semibold ${T_PRIMARY}`}>
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

      <div className="grid md:grid-cols-2 gap-3">
        {spots.length === 0 && <div className={T_PRIMARY}>{t("Aucun coin enregistré.")}</div>}
        {spots.map(s => (
          <Card key={s.id} className="bg-neutral-900 border-neutral-800 rounded-2xl overflow-hidden relative">
            <button onClick={() => setDetails(s)} className="block text-left">
              <img src={s.cover || s.photo} className="w-full h-40 object-cover" />
            </button>
            <button
              onClick={() => setEditing(s)}
              className="absolute top-2 right-2 bg-neutral-900/80 hover:bg-neutral-800/80 border border-neutral-700 rounded-full p-2"
              aria-label={t("modifier")}
            >
              <Pencil className="w-4 h-4 text-neutral-200" />
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
                <Button onClick={onRoute} className={BTN}>
                  <Route className="w-4 h-4 mr-2" />
                  {t("Itinéraire")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
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

      {editing && (
        <EditSpotModal
          spot={editing}
          onClose={() => setEditing(null)}
          onSave={(u) => {
            dispatch({ type: "updateSpot", spot: u });
            setEditing(null);
          }}
        />
      )}

      {details && (
        <SpotDetailsModal spot={details} onClose={() => setDetails(null)} />
      )}
    </motion.section>
  );
}
