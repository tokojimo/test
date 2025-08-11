import React from 'react';

export function ActionsBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:justify-end">
      {children}
    </div>
  );
}

export default ActionsBar;
