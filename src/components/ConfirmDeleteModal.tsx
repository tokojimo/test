import React from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { BTN, T_PRIMARY } from "../styles/tokens";
import { useT } from "../i18n";

export function ConfirmDeleteModal({ open, onConfirm, onCancel }: { open: boolean; onConfirm: () => void; onCancel: () => void }) {
  const { t } = useT();
  return (
    <Modal open={open} onClose={onCancel}>
      <div className="space-y-4">
        <p className={`text-center ${T_PRIMARY}`}>{t("Supprimer ce coin ?")}</p>
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={onCancel}
            className={`rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-800 ${T_PRIMARY}`}
          >
            {t("Annuler")}
          </Button>
          <Button variant="destructive" onClick={onConfirm} className={BTN}>
            {t("Supprimer")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
