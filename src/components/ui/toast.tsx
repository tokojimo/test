import React from "react";

export function Toast({ message, open }: { message: string; open: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-foreground text-paper px-4 py-2 rounded-md shadow-md" role="status">
      {message}
    </div>
  );
}

