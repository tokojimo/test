import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { alertsSchema, AlertsValues } from '../../validation/alerts';
import { useAlerts, useSettingsStore } from '../../stores/settings';
import { useToasts } from '../../components/settings/Toasts';
import { Switch } from '../../components/settings/Switch';

export default function Alerts() {
  const alerts = useAlerts();
  const update = useSettingsStore((s) => s.update);
  const { add } = useToasts();
  const { handleSubmit, watch, setValue } = useForm<AlertsValues>({
    resolver: zodResolver(alertsSchema),
    defaultValues: alerts,
  });

  const onSubmit = handleSubmit(async (values) => {
    update({ alerts: values });
    add('Alertes enregistrées');
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Switch
        checked={watch('optimum')}
        onChange={(v) => setValue('optimum', v)}
        label="Optimum prévu"
      />
      <Switch
        checked={watch('newZone')}
        onChange={(v) => setValue('newZone', v)}
        label="Nouvelle zone proche"
      />
      <button type="submit" className="px-3 py-2 border rounded">
        Enregistrer
      </button>
    </form>
  );
}
