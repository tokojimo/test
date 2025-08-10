import React, { useEffect } from "react";
import { T_PRIMARY } from "../styles/tokens";

export interface Notification {
  id: number;
  message: string;
}

export function NotificationStack({
  notifications,
  onRemove,
}: {
  notifications: Notification[];
  onRemove: (id: number) => void;
}) {
  useEffect(() => {
    if (notifications.length > 3) {
      onRemove(notifications[0].id);
    }
  }, [notifications, onRemove]);

  return (
    <div className="fixed top-3 right-3 flex flex-col gap-2 z-50">
      {notifications.slice(0, 3).map((n) => (
        <NotificationItem key={n.id} item={n} onRemove={onRemove} />
      ))}
    </div>
  );
}

function NotificationItem({
  item,
  onRemove,
}: {
  item: Notification;
  onRemove: (id: number) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(item.id), 3000);
    return () => clearTimeout(timer);
  }, [item.id, onRemove]);

  return (
    <div
      className={`bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl px-3 py-2 shadow ${T_PRIMARY}`}
    >
      {item.message}
    </div>
  );
}
