import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

function GoogleIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.9-6.9C35.81 2.93 30.24 0 24 0 14.7 0 6.44 5.4 2.47 13.26l7.98 6.2C12.44 13.64 17.7 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24c0-1.6-.14-3.14-.39-4.64H24v9.28h12.7c-.55 2.96-2.18 5.46-4.63 7.15l7.48 5.8C43.89 37.11 46.5 31 46.5 24z"/>
      <path fill="#FBBC05" d="M10.45 28.47c-.47-1.41-.73-2.91-.73-4.47s.26-3.06.73-4.47l-7.98-6.2C.92 16.44 0 20.11 0 24s.92 7.56 2.47 10.67l7.98-6.2z"/>
      <path fill="#34A853" d="M24 46.5c6.48 0 11.92-2.13 15.9-5.77l-7.48-5.8c-2.07 1.39-4.72 2.21-8.42 2.21-6.3 0-11.56-4.14-13.55-9.96l-7.98 6.2C6.44 42.6 14.7 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
  );
}

export interface GoogleButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function GoogleButton({ onClick, disabled, loading }: GoogleButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full md:w-auto h-10 px-4 rounded-lg shadow-sm"
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <GoogleIcon className="mr-2 h-4 w-4" />
      )}
      <span>Se connecter avec Google</span>
    </Button>
  );
}

export default GoogleButton;
