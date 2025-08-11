import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { preferencesSchema, PreferencesValues } from '../../validation/preferences';
import { usePrefs, useSettingsStore } from '../../stores/settings';
import { Switch } from '../../components/settings/Switch';
import { Select } from '../../components/settings/Select';
import { useToasts } from '../../components/settings/Toasts';

export default function Preferences() {
  const prefs = usePrefs();
  const update = useSettingsStore((s) => s.update);
  const { add } = useToasts();
  const { handleSubmit, watch, setValue } = useForm<PreferencesValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: prefs,
  });

  const onSubmit = handleSubmit((values) => {
    update({ prefs: values });
    add('Préférences enregistrées');
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Select
        label="Unités"
        value={watch('units')}
        onChange={(v) => setValue('units', v as any)}
        options={[
          { value: 'metric', label: 'métriques' },
          { value: 'imperial', label: 'impériales' },
        ]}
      />
      <Switch
        checked={watch('gps')}
        onChange={(v) => setValue('gps', v)}
        label="GPS"
      />
      <Select
        label="Langue"
        value={watch('lang')}
        onChange={(v) => setValue('lang', v as any)}
        options={[
          { value: 'fr', label: 'français' },
          { value: 'en', label: 'anglais' },
        ]}
      />
      <Select
        label="Thème"
        value={watch('theme')}
        onChange={(v) => setValue('theme', v as any)}
        options={[
          { value: 'system', label: 'Système' },
          { value: 'light', label: 'Clair' },
          { value: 'dark', label: 'Sombre' },
        ]}
      />
      <button type="submit" className="px-3 py-2 border rounded">
        Enregistrer
      </button>
    </form>
  );
}
