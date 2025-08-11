import React, { useState } from 'react';
import { enqueue } from '../../api/maps';
import { MapAreaPicker } from '../../components/settings/MapAreaPicker';
import { DownloadQueue } from '../../components/settings/DownloadQueue';
import { useToasts } from '../../components/settings/Toasts';
import { Button } from '@/components/ui/button';
import ActionsBar from '@/components/settings/ActionsBar';
import { useT } from '@/i18n';

export default function OfflineMaps() {
  const { add } = useToasts();
  const { t } = useT();
  const [area, setArea] = useState({ lat: 45.764, lng: 4.8357, radius: 10 });
  const handleDownload = async () => {
    await enqueue({ id: Date.now().toString(), name: 'Zone', radiusKm: area.radius });
    add(t('Téléchargement ajouté'));
  };
  return (
    <div className="space-y-6">
      <MapAreaPicker onChange={(lat, lng, radius) => setArea({ lat, lng, radius })} />
      <ActionsBar>
        <Button
          onClick={handleDownload}
          className="w-full md:w-auto h-10 px-4 rounded-lg shadow-sm"
        >
          {t('Télécharger une zone')}
        </Button>
      </ActionsBar>
      <DownloadQueue />
    </div>
  );
}
