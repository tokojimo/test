import React from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { T_PRIMARY } from "../styles/tokens";
import { useT } from "../i18n";

export function ConfirmDeleteModal({ open, onConfirm, onCancel }: { open: boolean; onConfirm: () => void; onCancel: () => void }) {
  const { t } = useT();
  return (
    <Modal
      open={open}
      onClose={onCancel}
      contentClassName="max-w-xs w-[min(90vw,20rem)] rounded-3xl overflow-hidden p-0"
    >
      <div className="flex flex-col">
        <div className="space-y-3 px-6 pt-6 pb-4 text-center">
          <p className={`text-base font-semibold ${T_PRIMARY}`}>{t("Supprimer ce coin ?")}</p>
        </div>
        <div className="border-t border-border">
          <div className="flex flex-col divide-y divide-border">
            <Button
              variant="ghost"
              onClick={onCancel}
              className={`w-full rounded-none py-4 text-base ${T_PRIMARY}`}
            >
              {t("Annuler")}
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              className="w-full rounded-none py-4 text-base"
            >
              {t("Supprimer")}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
