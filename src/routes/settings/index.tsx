import React, { useEffect, useState } from 'react';
import Account from './Account';
import Subscription from './Subscription';
import OfflineMaps from './OfflineMaps';
import Alerts from './Alerts';
import Preferences from './Preferences';
import Legal from './Legal';
import { Tabs } from '@/components/ui/tabs';
import { Accordion } from '@/components/ui/accordion';
import Section from '@/components/settings/Section';
import '../../styles/settings.css';

const sections = [
  { id: 'account', label: 'Compte', element: <Account /> },
  { id: 'abonnement', label: 'Abonnement', element: <Subscription /> },
  { id: 'cartes', label: 'Cartes hors-ligne', element: <OfflineMaps /> },
  { id: 'alertes', label: 'Alertes', element: <Alerts /> },
  { id: 'preferences', label: 'Préférences', element: <Preferences /> },
  { id: 'legal', label: 'Légal', element: <Legal /> },
];

export default function SettingsIndex() {
  const [active, setActive] = useState(() =>
    window.location.hash.replace('#', '') || 'account'
  );

  useEffect(() => {
    if (active) window.location.hash = active;
  }, [active]);

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Réglages</h1>
        <p className="text-sm text-foreground/70">Configurer l'application</p>
      </header>

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
