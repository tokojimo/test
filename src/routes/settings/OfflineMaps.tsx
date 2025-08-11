import React, { useState } from 'react';
import { enqueue } from '../../api/maps';
import { MapAreaPicker } from '../../components/settings/MapAreaPicker';
import { DownloadQueue } from '../../components/settings/DownloadQueue';
import { useToasts } from '../../components/settings/Toasts';

export default function OfflineMaps() {
  const { add } = useToasts();
  const [area, setArea] = useState({ lat: 45.764, lng: 4.8357, radius: 10 });
  const handleDownload = async () => {
    await enqueue({ id: Date.now().toString(), name: 'Zone', radiusKm: area.radius });
    add('Téléchargement ajouté');
  };
  return (
    <div className="space-y-4">
      <MapAreaPicker onChange={(lat, lng, radius) => setArea({ lat, lng, radius })} />
      <button onClick={handleDownload} className="px-3 py-2 border rounded">
        Télécharger une zone
      </button>
      <DownloadQueue />
    </div>
  );
}
