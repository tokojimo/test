import React, { useState } from 'react';
import { upgrade } from '../../api/subscription';
import { useSubscription, useSettingsStore } from '../../stores/settings';
import { useToasts } from '../../components/settings/Toasts';

export default function Subscription() {
  const sub = useSubscription();
  const update = useSettingsStore((s) => s.update);
  const { add } = useToasts();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    const res = await upgrade();
    update({ subscription: res });
    add('Passé en Premium');
    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <p>Statut: {sub.status === 'premium' ? 'Premium' : 'Gratuit'}</p>
      {sub.renewalDate && <p>Renouvellement: {new Date(sub.renewalDate).toLocaleDateString()}</p>}
      {sub.status === 'free' && (
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="px-3 py-2 border rounded"
        >
          Passer en Premium
        </button>
      )}
    </div>
  );
}
