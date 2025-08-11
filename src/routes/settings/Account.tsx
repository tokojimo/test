import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { login, logout } from '../../api/user';
import { useAccount, useSettingsStore } from '../../stores/settings';
import { useToasts } from '../../components/settings/Toasts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import FieldRow from '@/components/settings/FieldRow';
import ActionsBar from '@/components/settings/ActionsBar';

const schema = z.object({ email: z.string().email(), password: z.string().min(4) });
type FormValues = z.infer<typeof schema>;

export default function Account() {
  const account = useAccount();
  const update = useSettingsStore((s) => s.update);
  const { add } = useToasts();
  const {
    register,
    handleSubmit,
    formState,
  } = useForm<FormValues>({
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
    <div className="space-y-6">
      <p className="text-sm text-foreground">État de session: {account.session === 'connected' ? 'Connecté' : 'Déconnecté'}</p>
      {account.session === 'connected' ? (
        <div className="space-y-4">
          <p>{account.email}</p>
          <ActionsBar>
            <Button
              type="button"
              variant="secondary"
              onClick={handleLogout}
              className="w-full md:w-auto h-10 px-4 rounded-lg shadow-sm"
            >
              Se déconnecter
            </Button>
          </ActionsBar>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6">
          <FieldRow
            label="Email"
            error={formState.errors.email && 'Email invalide'}
          >
            <Input {...register('email')} placeholder="Email" />
          </FieldRow>
          <FieldRow label="Mot de passe">
            <Input
              {...register('password')}
              type="password"
              placeholder="Mot de passe"
            />
          </FieldRow>
          <ActionsBar>
            <Button
              type="submit"
              disabled={formState.isSubmitting}
              className="w-full md:w-auto h-10 px-4 rounded-lg shadow-sm"
            >
              Se connecter
            </Button>
          </ActionsBar>
        </form>
      )}
    </div>
  );
}
