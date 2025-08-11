import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { alertsSchema, AlertsValues } from '../../validation/alerts';
import { useAlerts, useSettingsStore } from '../../stores/settings';
import { useToasts } from '../../components/settings/Toasts';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import FieldRow from '@/components/settings/FieldRow';
import ActionsBar from '@/components/settings/ActionsBar';
import { useT } from '@/i18n';

export default function Alerts() {
  const alerts = useAlerts();
  const update = useSettingsStore((s) => s.update);
  const { add } = useToasts();
  const { t } = useT();
  const { handleSubmit, watch, setValue } = useForm<AlertsValues>({
    resolver: zodResolver(alertsSchema),
    defaultValues: alerts,
  });

  const onSubmit = handleSubmit(async (values) => {
    update({ alerts: values });
    add(t('Alertes enregistrées'));
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FieldRow label={t('Optimum prévu')}>
        <Switch
          checked={watch('optimum')}
          onCheckedChange={(v) => setValue('optimum', v)}
        />
      </FieldRow>
      <FieldRow label={t('Nouvelle zone proche')}>
        <Switch
          checked={watch('newZone')}
          onCheckedChange={(v) => setValue('newZone', v)}
        />
      </FieldRow>
      <ActionsBar>
        <Button type="submit" className="w-full md:w-auto h-10 px-4 rounded-lg shadow-sm">
          {t('Enregistrer')}
        </Button>
      </ActionsBar>
    </form>
  );
}
