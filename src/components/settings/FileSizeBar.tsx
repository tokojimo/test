import React from 'react';

type Props = {
  used: number;
  total: number;
};

export const FileSizeBar: React.FC<Props> = ({ used, total }) => {
  const pct = total === 0 ? 0 : Math.min(100, Math.round((used / total) * 100));
  return (
    <div className="w-full bg-gray-200 h-2 rounded">
      <div className="bg-blue-500 h-2 rounded" style={{ width: pct + '%' }} />
    </div>
  );
};
