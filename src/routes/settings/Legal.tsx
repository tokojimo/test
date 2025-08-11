import React from 'react';

export default function Legal() {
  return (
    <div className="space-y-2">
      <a href="/privacy" className="text-blue-600 underline">
        Politique de confidentialité
      </a>
      <a href="/terms" className="text-blue-600 underline block">
        Conditions d'utilisation
      </a>
      <button className="px-3 py-2 border rounded">Exporter mes données</button>
      <button className="px-3 py-2 border rounded">Supprimer mes données</button>
    </div>
  );
}
