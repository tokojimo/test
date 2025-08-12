import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useT } from '@/i18n';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DangerModal({ open, onClose, onConfirm }: Props) {
  const { t } = useT();
  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-4">
        <p>{t('Cette action est irréversible.')}</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            {t('Annuler')}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t('Supprimer')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DangerModal;
