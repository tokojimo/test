import React from 'react';

type Props = {
  title: string;
  description?: string;
  actionLabel: string;
  onAction: () => void;
};

export const DangerZone: React.FC<Props> = ({
  title,
  description,
  actionLabel,
  onAction,
}) => (
  <div className="border border-red-500 rounded p-4 bg-red-50">
    <h3 className="font-bold text-red-700 mb-2">{title}</h3>
    {description && <p className="text-sm mb-2">{description}</p>}
    <button
      type="button"
      onClick={() => {
        if (window.confirm(actionLabel)) onAction();
      }}
      className="px-3 py-2 bg-red-600 text-white rounded"
    >
      {actionLabel}
    </button>
  </div>
);
