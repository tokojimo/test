import React, { useState } from 'react';
import Account from './Account';
import Subscription from './Subscription';
import OfflineMaps from './OfflineMaps';
import Alerts from './Alerts';
import Preferences from './Preferences';
import Legal from './Legal';

const sections = [
  { id: 'account', label: 'Compte', component: <Account /> },
  { id: 'subscription', label: 'Abonnement', component: <Subscription /> },
  { id: 'maps', label: 'Cartes hors-ligne', component: <OfflineMaps /> },
  { id: 'alerts', label: 'Alertes', component: <Alerts /> },
  { id: 'prefs', label: 'Préférences', component: <Preferences /> },
  { id: 'legal', label: 'Légal', component: <Legal /> },
];

export default function SettingsIndex() {
  const [tab, setTab] = useState('account');
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Réglages</h1>
      <div className="hidden md:flex gap-2 mb-4" role="tablist">
        {sections.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={tab === s.id}
            onClick={() => setTab(s.id)}
            className={`px-2 py-1 border-b-2 ${tab === s.id ? 'border-black' : 'border-transparent'}`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="md:hidden" role="presentation">
        {sections.map((s) => (
          <details key={s.id} className="mb-2" open={tab === s.id} onClick={() => setTab(s.id)}>
            <summary className="font-medium">{s.label}</summary>
            <div className="p-2">{s.component}</div>
          </details>
        ))}
      </div>
      <div className="hidden md:block" role="tabpanel">
        {sections.find((s) => s.id === tab)?.component}
      </div>
    </div>
  );
}
