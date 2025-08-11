import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login, logout } from '../../api/user';
import { useAccount, useSettingsStore } from '../../stores/settings';
import { useToasts } from '../../components/settings/Toasts';

const schema = z.object({ email: z.string().email(), password: z.string().min(4) });
type FormValues = z.infer<typeof schema>;

export default function Account() {
  const account = useAccount();
  const update = useSettingsStore((s) => s.update);
  const { add } = useToasts();
  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (values) => {
    const user = await login(values);
    update({ account: { session: 'connected', email: user.email } });
    add('Connecté');
  });

  const handleLogout = async () => {
    await logout();
    update({ account: { session: 'disconnected' } });
    add('Déconnecté');
  };

  return (
    <div className="space-y-4">
      <p>État de session: {account.session === 'connected' ? 'Connecté' : 'Déconnecté'}</p>
      {account.session === 'connected' ? (
        <div className="space-y-2">
          <p>{account.email}</p>
          <button onClick={handleLogout} className="px-3 py-2 border rounded">
            Se déconnecter
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-2">
          <input
            {...register('email')}
            placeholder="Email"
            className="border p-2 rounded w-full"
          />
          {formState.errors.email && <span className="text-red-500 text-sm">Email invalide</span>}
          <input
            {...register('password')}
            type="password"
            placeholder="Mot de passe"
            className="border p-2 rounded w-full"
          />
          <button type="submit" disabled={formState.isSubmitting} className="px-3 py-2 border rounded">
            Se connecter
          </button>
        </form>
      )}
    </div>
  );
}
