import React from 'react';
import { Button } from '@/components/ui/button';
import ActionsBar from '@/components/settings/ActionsBar';

export default function Legal() {
  return (
    <div className="space-y-6">
      <a href="/privacy" className="text-sm text-foreground underline">
        Politique de confidentialité
      </a>
      <a href="/terms" className="text-sm text-foreground underline">
        Conditions d'utilisation
      </a>
      <ActionsBar>
        <Button variant="secondary" className="w-full md:w-auto h-10 px-4 rounded-lg shadow-sm">
          Exporter mes données
        </Button>
        <Button variant="destructive" className="w-full md:w-auto h-10 px-4 rounded-lg shadow-sm">
          Supprimer mes données
        </Button>
      </ActionsBar>
    </div>
  );
}
