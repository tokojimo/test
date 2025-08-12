import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getSession } from '@/lib/auth';
import { useSettingsStore } from '@/stores/settings';
import { useToasts } from '@/components/settings/Toasts';
import { Loader2 } from 'lucide-react';

export default function Callback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const update = useSettingsStore((s) => s.update);
  const { add } = useToasts();

  useEffect(() => {
    (async () => {
      const session = await getSession();
      const next = params.get('next') || '/settings#compte';
      if (session?.user) {
        update({ account: { session: 'connected', email: session.user.email || undefined } });
        add('Connecté');
        navigate(next);
      } else {
        add('Connexion échouée');
        navigate(next);
      }
    })();
  }, [navigate, params, update, add]);

  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-6 w-6 animate-spin" aria-label="Chargement" />
    </div>
  );
}
