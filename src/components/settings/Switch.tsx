import React from 'react';

type Props = {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  id?: string;
};

export const Switch: React.FC<Props> = ({ checked, onChange, label, id }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className={`px-3 py-2 rounded-full border ${
        checked ? 'bg-green-500 text-white' : 'bg-gray-200'
      } focus-visible:outline focus-visible:outline-2`}
    >
      {label}
    </button>
  );
};
