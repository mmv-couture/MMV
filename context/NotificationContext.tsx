import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'tutorial' | 'system' | 'alert' | 'success';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
  expiresAt?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  getTutorialNotifications: () => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = 'mmv_notifications';
const LAST_SEEN_TUTORIAL_KEY = 'mmv_last_seen_tutorial';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Load notifications from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Filter out expired notifications
        const now = new Date().toISOString();
        const valid = parsed.filter((n: Notification) => !n.expiresAt || n.expiresAt > now);
        setNotifications(valid);
      } catch (e) {
        console.error('Error loading notifications:', e);
      }
    }
    setInitialized(true);
  }, []);

  // Save notifications to localStorage
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }
  }, [notifications, initialized]);

  // Check for new tutorials and create notifications
  useEffect(() => {
    if (!initialized) return;

    const checkForNewTutorials = () => {
      const tutorials = localStorage.getItem('mmv_tutorials');
      const lastSeen = localStorage.getItem(LAST_SEEN_TUTORIAL_KEY);
      
      if (tutorials) {
        try {
          const tutorialList = JSON.parse(tutorials);
          const lastSeenDate = lastSeen ? new Date(lastSeen) : new Date(0);
          
          tutorialList.forEach((tutorial: any) => {
            const tutorialDate = new Date(tutorial.createdAt);
            if (tutorialDate > lastSeenDate) {
              // Check if notification already exists
              const exists = notifications.some(
                n => n.type === 'tutorial' && n.data?.tutorialId === tutorial.id
              );
              
              if (!exists) {
                addNotification({
                  type: 'tutorial',
                  title: '📹 Nouveau tutoriel disponible',
                  message: `"${tutorial.title}" - ${tutorial.category}`,
                  data: { 
                    tutorialId: tutorial.id,
                    videoUrl: tutorial.videoUrl,
                    thumbnail: tutorial.imageUrl
                  },
                  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
                });
              }
            }
          });
          
          localStorage.setItem(LAST_SEEN_TUTORIAL_KEY, new Date().toISOString());
        } catch (e) {
          console.error('Error checking tutorials:', e);
        }
      }
    };

    // Check immediately and every 30 seconds
    checkForNewTutorials();
    const interval = setInterval(checkForNewTutorials, 30000);
    
    return () => clearInterval(interval);
  }, [initialized, notifications]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const getTutorialNotifications = useCallback(() => {
    return notifications.filter(n => n.type === 'tutorial');
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      getTutorialNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
