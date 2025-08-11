import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { preferencesSchema, PreferencesValues } from '../../validation/preferences';
import { usePrefs, useSettingsStore } from '../../stores/settings';
import { useToasts } from '../../components/settings/Toasts';
import { Switch } from '@/components/ui/switch';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import FieldRow from '@/components/settings/FieldRow';
import ActionsBar from '@/components/settings/ActionsBar';

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
    <form onSubmit={onSubmit} className="space-y-6">
      <FieldRow label="Unités">
        <Select
          value={watch('units')}
          onChange={(e) => setValue('units', e.target.value as any)}
        >
          <option value="metric">métriques</option>
          <option value="imperial">impériales</option>
        </Select>
      </FieldRow>
      <FieldRow label="GPS">
        <Switch
          checked={watch('gps')}
          onCheckedChange={(v) => setValue('gps', v)}
        />
      </FieldRow>
      <FieldRow label="Langue">
        <Select
          value={watch('lang')}
          onChange={(e) => setValue('lang', e.target.value as any)}
        >
          <option value="fr">français</option>
          <option value="en">anglais</option>
        </Select>
      </FieldRow>
      <FieldRow label="Thème">
        <Select
          value={watch('theme')}
          onChange={(e) => setValue('theme', e.target.value as any)}
        >
          <option value="system">Système</option>
          <option value="light">Clair</option>
          <option value="dark">Sombre</option>
        </Select>
      </FieldRow>
      <ActionsBar>
        <Button type="submit" className="w-full md:w-auto h-10 px-4 rounded-lg shadow-sm">
          Enregistrer
        </Button>
      </ActionsBar>
    </form>
  );
}
