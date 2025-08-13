import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Account from './Account';
import Subscription from './Subscription';
import OfflineMaps from './OfflineMaps';
import Alerts from './Alerts';
import Preferences from './Preferences';
import Legal from './Legal';
import { Tabs } from '@/components/ui/tabs';
import { Accordion } from '@/components/ui/accordion';
import Section from '@/components/settings/Section';
import { Button } from '@/components/ui/button';
import { useT } from '@/i18n';
import '../../styles/settings.css';

export default function SettingsIndex() {
  const { t } = useT();
  const navigate = useNavigate();
  const [active, setActive] = useState(() =>
    window.location.hash.replace('#', '') || 'account'
  );

  const sections = [
    { id: 'account', label: t('Compte'), element: <Account /> },
    { id: 'abonnement', label: t('Abonnement'), element: <Subscription /> },
    { id: 'cartes', label: t('Cartes hors‑ligne'), element: <OfflineMaps /> },
    { id: 'alertes', label: t('Alertes'), element: <Alerts /> },
    { id: 'preferences', label: t('Préférences'), element: <Preferences /> },
    { id: 'legal', label: t('Légal'), element: <Legal /> },
  ];

  useEffect(() => {
    if (active) {
      window.history.replaceState(null, '', `${window.location.pathname}#${active}`);
    }
  }, [active]);

  return (
    <div className="container max-w-3xl mx-auto py-6 space-y-6">
      <header className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          aria-label={t('Retour')}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-semibold text-foreground">{t('Réglages')}</h1>
      </header>
      <p className="text-sm text-foreground/70">{t("Configurer l'application")}</p>

      <div className="md:hidden">
        <Accordion
          items={sections.map((s) => ({
            id: s.id,
            label: s.label,
            content: <Section id={s.id}>{s.element}</Section>,
          }))}
          value={active}
          onChange={setActive}
        />
      </div>

      <div className="hidden md:block">
        <Tabs
          tabs={sections.map((s) => ({ id: s.id, label: s.label }))}
          active={active}
          onChange={setActive}
        />
        <div className="mt-6">
          {sections.map((s) => (
            <div key={s.id} className={s.id === active ? 'block' : 'hidden'}>
              <Section id={s.id}>{s.element}</Section>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
