import React, { useState } from 'react';
import { createNotification } from '../services/notificationService';

interface CreateNotificationFormProps {
  onNotificationCreated: () => void;
}

const CreateNotificationForm: React.FC<CreateNotificationFormProps> = ({ onNotificationCreated }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !message.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const result = await createNotification({
        title,
        message,
      });
      
      if (result) {
        setTitle('');
        setMessage('');
        onNotificationCreated();
      } else {
        setError('Error al crear la notificación');
      }
    } catch (err) {
      setError('Ocurrió un error al enviar el formulario');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Crear Nueva Notificación</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Título de la notificación"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Mensaje
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contenido de la notificación"
            rows={4}
            disabled={isSubmitting}
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Crear Notificación'}
        </button>
      </form>
    </div>
  );
};

export default CreateNotificationForm; 