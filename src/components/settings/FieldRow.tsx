import React from 'react';

interface Props {
  label: string;
  help?: string;
  error?: string;
  children: React.ReactNode;
}

export function FieldRow({ label, help, error, children }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {help && <p className="text-sm text-foreground/70">{help}</p>}
      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default FieldRow;
