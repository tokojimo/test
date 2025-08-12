import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Props {
  email?: string;
  provider?: string;
  onLogout: () => void;
}

export function AccountSummary({ email, provider, onLogout }: Props) {
  return (
    <div className="space-y-4">
      {email && <p className="text-sm text-foreground">{email}</p>}
      {provider && <Badge>{provider}</Badge>}
      <Button
        type="button"
        variant="secondary"
        onClick={onLogout}
        className="w-full md:w-auto h-10 px-4 rounded-lg shadow-sm"
      >
        Se déconnecter
      </Button>
    </div>
  );
}

export default AccountSummary;
