import React from 'react';
import { Card } from '@/components/ui/card';

export function Section({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <Card id={id} className="py-6 px-5 md:py-8 md:px-8 space-y-5">
      {children}
    </Card>
  );
}

export default Section;
