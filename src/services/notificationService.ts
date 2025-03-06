import { NotificationType } from '../components/NotificationList';

// URL base de la API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Función para obtener todas las notificaciones
export async function getNotifications(): Promise<NotificationType[]> {
  try {
    const response = await fetch(`${API_URL}/notifications`);
    
    if (!response.ok) {
      throw new Error('Error al obtener notificaciones');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en getNotifications:', error);
    return [];
  }
}

// Función para marcar una notificación como leída
export async function markAsRead(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error en markAsRead:', error);
    return false;
  }
}

// Función para eliminar una notificación
export async function deleteNotification(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/notifications/${id}`, {
      method: 'DELETE',
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error en deleteNotification:', error);
    return false;
  }
}

// Función para crear una nueva notificación (para pruebas)
export async function createNotification(notification: Omit<NotificationType, 'id' | 'timestamp' | 'read'>): Promise<NotificationType | null> {
  try {
    const response = await fetch(`${API_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    });
    
    if (!response.ok) {
      throw new Error('Error al crear notificación');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error en createNotification:', error);
    return null;
  }
} 