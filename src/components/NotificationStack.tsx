import React, { useEffect } from "react";
import { T_PRIMARY } from "@/styles/tokens";

export interface Notification {
  id: number;
  message: string;
}

export default function NotificationStack({
  notifications,
  onRemove,
}: {
  notifications: Notification[];
  onRemove: (id: number) => void;
}) {
  const items = notifications.slice(-3);
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {items.map((n) => (
        <NotificationItem key={n.id} message={n.message} onDismiss={() => onRemove(n.id)} />
      ))}
    </div>
  );
}

function NotificationItem({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);
  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded px-4 py-2 shadow">
      <span className={`text-sm ${T_PRIMARY}`}>{message}</span>
    </div>
  );
}

