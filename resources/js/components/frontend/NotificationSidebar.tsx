import React from 'react';
import { X, Bell, Package, CreditCard, Gift, Info, Clock, CheckCircle } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { Link } from '@inertiajs/react';

export default function NotificationSidebar() {
    const { 
        notifications, 
        isOpen, 
        closeNotifications, 
        markAsRead, 
        markAllAsRead,
        removeNotification 
    } = useNotifications();

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'order':
                return <Package className="w-5 h-5 text-blue-600" />;
            case 'payment':
                return <CreditCard className="w-5 h-5 text-green-600" />;
            case 'promotion':
                return <Gift className="w-5 h-5 text-purple-600" />;
            default:
                return <Info className="w-5 h-5 text-gray-600" />;
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'order':
                return 'bg-blue-50 border-blue-200';
            case 'payment':
                return 'bg-green-50 border-green-200';
            case 'promotion':
                return 'bg-purple-50 border-purple-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    };

    const handleNotificationClick = (notification: any) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 border-l border-gray-200">
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-2">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            Notifications
                        </h2>
                    </div>
                    <button
                        onClick={closeNotifications}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Actions */}
                {notifications.length > 0 && (
                    <div className="px-4 py-2 border-b bg-gray-50">
                        <button
                            onClick={markAllAsRead}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Mark all as read
                        </button>
                    </div>
                )}

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6">
                            <Bell className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                            <p className="text-gray-500">You're all caught up! Check back later for updates.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer relative ${
                                        !notification.read ? 'bg-blue-50' : ''
                                    }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    {/* Unread indicator */}
                                    {!notification.read && (
                                        <div className="absolute left-2 top-6 w-2 h-2 bg-blue-600 rounded-full"></div>
                                    )}

                                    <div className="flex items-start space-x-3 ml-4">
                                        {/* Icon */}
                                        <div className={`flex-shrink-0 p-2 rounded-lg ${getNotificationColor(notification.type)}`}>
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className={`text-sm font-medium ${
                                                        !notification.read ? 'text-gray-900' : 'text-gray-700'
                                                    }`}>
                                                        {notification.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center mt-2 space-x-2">
                                                        <Clock className="w-3 h-3 text-gray-400" />
                                                        <span className="text-xs text-gray-500">
                                                            {formatTimeAgo(notification.created_at)}
                                                        </span>
                                                        {notification.read && (
                                                            <CheckCircle className="w-3 h-3 text-green-500" />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Remove button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeNotification(notification.id);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                                                    title="Remove notification"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Action button for order notifications */}
                                            {notification.type === 'order' && notification.order_id && (
                                                <Link
                                                    href={`/orders/${notification.order_id}`}
                                                    className="inline-block mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    View Order
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t p-4 bg-gray-50">
                    <Link
                        href="/notifications"
                        className="block w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        View All Notifications
                    </Link>
                </div>
            </div>
        </div>
    );
}
