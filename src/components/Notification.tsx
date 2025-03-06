import React from 'react';

interface NotificationProps {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const Notification: React.FC<NotificationProps> = ({
  id,
  title,
  message,
  timestamp,
  read,
  onMarkAsRead,
  onDelete
}) => {
  return (
    <div className={`border rounded-lg p-4 mb-3 ${read ? 'bg-gray-100' : 'bg-white border-blue-500'}`}>
      <div className="flex justify-between items-start">
        <h3 className={`text-lg font-semibold ${read ? 'text-gray-700' : 'text-blue-700'}`}>{title}</h3>
        <span className="text-xs text-gray-500">{timestamp}</span>
      </div>
      <p className="text-gray-600 my-2">{message}</p>
      <div className="flex justify-end gap-2 mt-2">
        {!read && (
          <button 
            onClick={() => onMarkAsRead(id)}
            className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Marcar como leída
          </button>
        )}
        <button 
          onClick={() => onDelete(id)}
          className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default Notification; 