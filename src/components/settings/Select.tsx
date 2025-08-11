import React from 'react';

type Option = { value: string; label: string };

type Props = {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  label: string;
  id?: string;
};

export const Select: React.FC<Props> = ({ value, onChange, options, label, id }) => (
  <label className="flex flex-col gap-1">
    <span>{label}</span>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border p-2 rounded"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </label>
);
