import React from 'react';
import { Button } from '@/components/ui/button';
import ActionsBar from '@/components/settings/ActionsBar';
import { useT } from '@/i18n';

export default function Legal() {
  const { t } = useT();
  return (
    <div className="space-y-6">
      <a href="/privacy" className="text-sm text-foreground underline">
        {t('Politique de confidentialité')}
      </a>
      <a href="/terms" className="text-sm text-foreground underline">
        {t("Conditions d'utilisation")}
      </a>
      <ActionsBar>
        <Button variant="secondary" className="w-full md:w-auto h-10 px-4 rounded-lg shadow-sm">
          {t('Exporter mes données')}
        </Button>
        <Button variant="destructive" className="w-full md:w-auto h-10 px-4 rounded-lg shadow-sm">
          {t('Supprimer mes données')}
        </Button>
      </ActionsBar>
    </div>
  );
}
