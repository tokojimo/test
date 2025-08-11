import React from 'react';

type Props = {
  value: number;
  onChange: (v: number) => void;
  label: string;
  id?: string;
  min?: number;
  max?: number;
};

export const NumberField: React.FC<Props> = ({
  value,
  onChange,
  label,
  id,
  min,
  max,
}) => (
  <label className="flex flex-col gap-1">
    <span>{label}</span>
    <input
      type="number"
      id={id}
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      className="border p-2 rounded"
    />
  </label>
);
