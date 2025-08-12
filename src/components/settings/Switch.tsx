import React from 'react';
import { Switch as BaseSwitch } from '@/components/ui/switch';
import { T_PRIMARY } from '../../styles/tokens';

type Props = {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  id?: string;
};

export const Switch: React.FC<Props> = ({ checked, onChange, label, id }) => {
  return (
    <label htmlFor={id} className="inline-flex items-center gap-2 cursor-pointer">
      <BaseSwitch id={id} checked={checked} onCheckedChange={onChange} />
      <span className={T_PRIMARY}>{label}</span>
    </label>
  );
};
