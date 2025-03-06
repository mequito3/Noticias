'use client';

import React, { useEffect, useState } from 'react';
import NotificationList, { NotificationType } from '../../components/NotificationList';
import CreateNotificationForm from '../../components/CreateNotificationForm';
import { getNotifications, markAsRead, deleteNotification } from '../../services/notificationService';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las notificaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    const success = await markAsRead(id);
    if (success) {
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteNotification(id);
    if (success) {
      setNotifications(notifications.filter(notification => notification.id !== id));
    }
  };

  const handleNotificationCreated = () => {
    loadNotifications();
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Notificaciones</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {showForm ? 'Cancelar' : 'Nueva Notificación'}
        </button>
      </div>
      
      {showForm && (
        <div className="mb-8">
          <CreateNotificationForm onNotificationCreated={handleNotificationCreated} />
        </div>
      )}
      
      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Cargando notificaciones...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <NotificationList 
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
} 