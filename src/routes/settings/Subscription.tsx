import React, { useState } from 'react';
import { upgrade } from '../../api/subscription';
import { useSubscription, useSettingsStore } from '../../stores/settings';
import { useToasts } from '../../components/settings/Toasts';
import { Button } from '@/components/ui/button';
import ActionsBar from '@/components/settings/ActionsBar';
import { useT } from '@/i18n';

export default function Subscription() {
  const sub = useSubscription();
  const update = useSettingsStore((s) => s.update);
  const { add } = useToasts();
  const { t } = useT();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    const res = await upgrade();
    update({ subscription: res });
    add(t('Passé en Premium'));
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-foreground">{t('Statut')}: {sub.status === 'premium' ? t('Premium') : t('Gratuit')}</p>
      {sub.renewalDate && (
        <p className="text-sm text-foreground">{t('Renouvellement')}: {new Date(sub.renewalDate).toLocaleDateString()}</p>
      )}
      {sub.status === 'free' && (
        <ActionsBar>
          <Button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full md:w-auto h-10 px-4 rounded-lg shadow-sm"
          >
            {t('Passer en premium')}
          </Button>
        </ActionsBar>
      )}
    </div>
  );
}
