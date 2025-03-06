import React from 'react';
import Notification from './Notification';

export interface NotificationType {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationListProps {
  notifications: NotificationType[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
  onDelete
}) => {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No tienes notificaciones
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          id={notification.id}
          title={notification.title}
          message={notification.message}
          timestamp={notification.timestamp}
          read={notification.read}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default NotificationList; 