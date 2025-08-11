import React, { useEffect, useState } from 'react';
import { listJobs, DownloadJob } from '../../api/maps';

export const DownloadQueue: React.FC = () => {
  const [jobs, setJobs] = useState<DownloadJob[]>([]);
  useEffect(() => {
    listJobs().then(setJobs);
  }, []);
  if (!jobs.length) return <p>Aucun téléchargement</p>;
  return (
    <ul className="space-y-1">
      {jobs.map((j) => (
        <li key={j.id} className="text-sm">
          {j.name} – {j.progress}%
        </li>
      ))}
    </ul>
  );
};
