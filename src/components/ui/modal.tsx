import React from "react";

export function Modal({
  open,
  onClose,
  children,
  contentClassName,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  contentClassName?: string;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`bg-background rounded-lg shadow-lg p-6 max-w-lg w-full ${contentClassName ?? ""}`}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

