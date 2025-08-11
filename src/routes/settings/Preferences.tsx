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
import { useT } from '@/i18n';
import { useAppContext } from '../../context/AppContext';

export default function Preferences() {
  const prefs = usePrefs();
  const update = useSettingsStore((s) => s.update);
  const { add } = useToasts();
  const { t } = useT();
  const { dispatch } = useAppContext();
  const { handleSubmit, watch, setValue } = useForm<PreferencesValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: prefs,
  });

  const onSubmit = handleSubmit((values) => {
    update({ prefs: values });
    dispatch({ type: 'setPrefs', prefs: values });
    add(t('Préférences enregistrées'));
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FieldRow label={t('Unités')}>
        <Select
          value={watch('units')}
          onChange={(e) => setValue('units', e.target.value as any)}
        >
          <option value="metric">{t('métriques')}</option>
          <option value="imperial">{t('impériales')}</option>
        </Select>
      </FieldRow>
      <FieldRow label={t('GPS')}>
        <Switch
          checked={watch('gps')}
          onCheckedChange={(v) => setValue('gps', v)}
        />
      </FieldRow>
      <FieldRow label={t('Langue')}>
        <Select
          value={watch('lang')}
          onChange={(e) => setValue('lang', e.target.value as any)}
        >
          <option value="fr">{t('français')}</option>
          <option value="en">{t('anglais')}</option>
        </Select>
      </FieldRow>
      <FieldRow label={t('Thème')}>
        <Select
          value={watch('theme')}
          onChange={(e) => setValue('theme', e.target.value as any)}
        >
          <option value="system">{t('Système')}</option>
          <option value="light">{t('Clair')}</option>
          <option value="dark">{t('Sombre')}</option>
        </Select>
      </FieldRow>
      <ActionsBar>
        <Button type="submit" className="w-full md:w-auto h-10 px-4 rounded-lg shadow-sm">
          {t('Enregistrer')}
        </Button>
      </ActionsBar>
    </form>
  );
}
