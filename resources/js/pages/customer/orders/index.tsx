import React, { useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ShopFrontLayout from '@/layouts/shop-front-layout';
import { Package, Clock, CheckCircle, XCircle, Eye, RotateCcw } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';

interface OrderItem {
    id: number;
    product: {
        id: number;
        name: string;
        price: number;
        image_url?: string;
    };
    quantity: number;
    price: number;
    total_price: number;
    notes?: string;
}

interface Order {
    id: number;
    status: string;
    total_amount: number;
    pickup_or_delivery: string;
    payment_method: string;
    payment_status: string;
    created_at: string;
    order_items: OrderItem[];
    customer_name: string;
    customer_phone: string;
}

interface Props extends Record<string, any> {
    orders: {
        data: Order[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

export default function CustomerOrdersIndex() {
    const { orders } = usePage<Props>().props;
    const { refreshNotifications } = useNotifications();

    // Refresh notifications when the page loads
    useEffect(() => {
        refreshNotifications();
    }, [refreshNotifications]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'payment_submitted':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'confirmed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'preparing':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'ready':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'completed':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4" />;
            case 'preparing':
            case 'ready':
                return <Package className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const formatStatus = (status: string) => {
        return status.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <ShopFrontLayout>
            <Head title="My Orders - Rovic Meat Products" />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
                        <p className="text-gray-600">Track and manage your orders</p>
                    </div>

                    {/* Orders List */}
                    {orders.data.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                            <p className="text-gray-500 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
                            <Link
                                href="/"
                                className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.data.map((order) => (
                                <div key={order.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                                    {/* Order Header */}
                                    <div className="p-6 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Order #{order.id}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {formatDate(order.created_at)}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    <span className="ml-2">{formatStatus(order.status)}</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-semibold text-gray-900">
                                                        ₱{Number(order.total_amount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                                    </p>
                                                    <p className="text-sm text-gray-500 capitalize">
                                                        {order.pickup_or_delivery} • {order.payment_method}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="p-6">
                                        <div className="space-y-3">
                                            {order.order_items.slice(0, 3).map((item, index) => (
                                                <div key={index} className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                                                        <p className="text-sm text-gray-500">
                                                            Qty: {item.quantity} × ₱{Number(item.price).toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <span className="font-medium text-gray-900">
                                                        ₱{Number(item.total_price).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                            {order.order_items.length > 3 && (
                                                <p className="text-sm text-gray-500 text-center pt-2">
                                                    +{order.order_items.length - 3} more items
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Order Actions */}
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex space-x-3">
                                                <Link
                                                    href={`/orders/${order.id}`}
                                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                </Link>
                                                {order.status === 'completed' && (
                                                    <Link
                                                        href={`/orders/${order.id}/reorder`}
                                                        method="post"
                                                        as="button"
                                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                                                    >
                                                        <RotateCcw className="w-4 h-4 mr-2" />
                                                        Reorder
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {orders.last_page > 1 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex space-x-2">
                                {orders.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                            link.active
                                                ? 'bg-red-600 text-white'
                                                : link.url
                                                ? 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                        disabled={!link.url}
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ShopFrontLayout>
    );
}
