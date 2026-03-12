// frontend/src/context/NotificationContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';

const NotificationContext = createContext(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const success = (message, duration) => addNotification(message, 'success', duration);
  const error = (message, duration) => addNotification(message, 'error', duration);
  const warning = (message, duration) => addNotification(message, 'warning', duration);
  const info = (message, duration) => addNotification(message, 'info', duration);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      success,
      error,
      warning,
      info
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Notification Component
const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  const getStyles = (type) => {
    switch(type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(({ id, message, type }) => (
        <div
          key={id}
          className={`p-4 rounded-lg border shadow-lg animate-slideIn ${getStyles(type)}`}
        >
          <div className="flex items-center justify-between">
            <p className="mr-4">{message}</p>
            <button
              onClick={() => removeNotification(id)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};