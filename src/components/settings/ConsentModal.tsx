import React from 'react';

type Props = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
};

export const ConsentModal: React.FC<Props> = ({ open, onConfirm, onCancel, message }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-4 rounded space-y-4">
        <p>{message}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onCancel} className="px-2 py-1 border rounded">Annuler</button>
          <button onClick={onConfirm} className="px-2 py-1 bg-blue-600 text-white rounded">OK</button>
        </div>
      </div>
    </div>
  );
};
