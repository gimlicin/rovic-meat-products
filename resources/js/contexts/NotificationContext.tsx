import React, { createContext, useContext, useState, ReactNode } from 'react';
import { router } from '@inertiajs/react';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'order' | 'payment' | 'promotion' | 'system';
    read: boolean;
    created_at: string;
    order_id?: number;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    isOpen: boolean;
    addNotification: (notification: Omit<Notification, 'id' | 'read' | 'created_at'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    toggleNotifications: () => void;
    closeNotifications: () => void;
    refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Load notifications from API with debouncing to prevent excessive requests
    const [isLoading, setIsLoading] = useState(false);
    
    const loadNotifications = async () => {
        // Prevent multiple simultaneous requests
        if (isLoading) return;
        
        setIsLoading(true);
        try {
            const csrfToken = (window as any).Laravel?.csrfToken;
            const response = await fetch('/api/notifications', {
                headers: {
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications || []);
            } else if (response.status === 401) {
                // Silently handle 401 (unauthenticated) - expected for logged out users
                setNotifications([]);
            } else {
                console.error('Failed to load notifications:', response.status);
                setNotifications([]);
            }
        } catch (error) {
            // Silently handle errors during logout/unauthenticated state
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Load notifications on mount
    React.useEffect(() => {
        loadNotifications();
        
        // Reload notifications after Inertia navigations (login, logout, etc.) with debouncing
        const handleFinish = () => {
            setTimeout(() => {
                // Only reload if not currently loading
                if (!isLoading) {
                    loadNotifications();
                }
            }, 500); // Increased delay to reduce frequency
        };

        router.on('finish', handleFinish);
        
        // Note: Inertia router doesn't support removing listeners
        // This is acceptable as it's a singleton and we want notifications to always reload on navigation
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const addNotification = (notificationData: Omit<Notification, 'id' | 'read' | 'created_at'>) => {
        const newNotification: Notification = {
            ...notificationData,
            id: Date.now().toString(),
            read: false,
            created_at: new Date().toISOString()
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const markAsRead = async (id: string) => {
        try {
            const csrfToken = (window as any).Laravel?.csrfToken;
            await fetch(`/api/notifications/${id}/read`, { 
                method: 'PATCH',
                headers: {
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                }
            });
            setNotifications(prev => 
                prev.map(notification => 
                    notification.id === id 
                        ? { ...notification, read: true }
                        : notification
                )
            );
        } catch (error) {
            // Silently handle errors
        }
    };

    const markAllAsRead = async () => {
        try {
            const csrfToken = (window as any).Laravel?.csrfToken;
            await fetch('/api/notifications/mark-all-read', { 
                method: 'PATCH',
                headers: {
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                }
            });
            setNotifications(prev => 
                prev.map(notification => ({ ...notification, read: true }))
            );
        } catch (error) {
            // Silently handle errors
        }
    };

    const removeNotification = async (id: string) => {
        try {
            const csrfToken = (window as any).Laravel?.csrfToken;
            await fetch(`/api/notifications/${id}`, { 
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': csrfToken || '',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                }
            });
            setNotifications(prev => prev.filter(notification => notification.id !== id));
        } catch (error) {
            // Silently handle errors
        }
    };

    const toggleNotifications = () => {
        setIsOpen(prev => !prev);
    };

    const closeNotifications = () => {
        setIsOpen(false);
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            isOpen,
            addNotification,
            markAsRead,
            markAllAsRead,
            removeNotification,
            toggleNotifications,
            closeNotifications,
            refreshNotifications: loadNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
