import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    Eye, 
    Check, 
    X, 
    Clock, 
    CreditCard, 
    Truck, 
    MapPin, 
    User, 
    Phone, 
    Mail,
    Calendar,
    FileImage,
    AlertTriangle
} from 'lucide-react';

interface Order {
    id: number;
    status: string;
    status_label: string;
    payment_method: string;
    payment_status: string;
    payment_proof_path?: string;
    payment_rejection_reason?: string;
    payment_submitted_at?: string;
    payment_approved_at?: string;
    total_price: number;
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    pickup_or_delivery: string;
    delivery_address?: string;
    scheduled_date?: string;
    created_at: string;
    user?: {
        name: string;
        email: string;
    };
    order_items: Array<{
        id: number;
        quantity: number;
        price: number;
        total_price: number;
        notes?: string;
        product: {
            id: number;
            name: string;
            image_url?: string;
        };
    }>;
    payment_approver?: {
        name: string;
    };
}

interface OrdersPageProps {
    orders: {
        data: Order[];
        links: any[];
        meta: any;
    };
    filters: {
        status?: string;
        delivery_type?: string;
        bulk_orders?: boolean;
    };
}

export default function OrdersIndex({ orders, filters }: OrdersPageProps) {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const { flash } = usePage().props as any;

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'pending':
                return 'secondary';
            case 'payment_submitted':
                return 'default';
            case 'payment_approved':
                return 'default';
            case 'payment_rejected':
                return 'destructive';
            case 'confirmed':
                return 'default';
            case 'preparing':
                return 'default';
            case 'ready':
                return 'default';
            case 'completed':
                return 'default';
            case 'cancelled':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    const getPaymentStatusBadge = (paymentStatus: string) => {
        switch (paymentStatus) {
            case 'pending':
                return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
            case 'submitted':
                return <Badge variant="default"><FileImage className="h-3 w-3 mr-1" />Submitted</Badge>;
            case 'approved':
                return <Badge variant="default"><Check className="h-3 w-3 mr-1" />Approved</Badge>;
            case 'rejected':
                return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Rejected</Badge>;
            default:
                return <Badge variant="secondary">Unknown</Badge>;
        }
    };

    const handleApprovePayment = (orderId: number) => {
        router.patch(route('admin.orders.approve-payment', orderId), {}, {
            preserveScroll: true,
        });
    };

    const handleRejectPayment = (orderId: number) => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }

        router.patch(route('admin.orders.reject-payment', orderId), {
            rejection_reason: rejectionReason
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowRejectDialog(false);
                setRejectionReason('');
                setSelectedOrder(null);
            }
        });
    };

    const handleStatusUpdate = (orderId: number, newStatus: string) => {
        router.patch(route('admin.orders.update-status', orderId), {
            status: newStatus
        }, {
            preserveScroll: true,
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <AppLayout>
            <Head title="Order Management - Admin" />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Order Management</h1>
                        <p className="text-gray-600 mt-2">Manage customer orders and payment approvals</p>
                    </div>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <Alert>
                        <Check className="h-4 w-4" />
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                {flash?.error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium">Status</label>
                                <Select 
                                    value={filters.status || ''} 
                                    onValueChange={(value) => {
                                        router.get(route('admin.orders.index'), { 
                                            ...filters, 
                                            status: value || undefined 
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All statuses</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="payment_submitted">Payment Submitted</SelectItem>
                                        <SelectItem value="payment_approved">Payment Approved</SelectItem>
                                        <SelectItem value="payment_rejected">Payment Rejected</SelectItem>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="preparing">Preparing</SelectItem>
                                        <SelectItem value="ready">Ready</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Delivery Type</label>
                                <Select 
                                    value={filters.delivery_type || ''} 
                                    onValueChange={(value) => {
                                        router.get(route('admin.orders.index'), { 
                                            ...filters, 
                                            delivery_type: value || undefined 
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All types</SelectItem>
                                        <SelectItem value="pickup">Pickup</SelectItem>
                                        <SelectItem value="delivery">Delivery</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders List */}
                <div className="space-y-4">
                    {orders.data.map((order) => (
                        <Card key={order.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            Order #{order.id}
                                            <Badge variant={getStatusBadgeVariant(order.status)}>
                                                {order.status_label}
                                            </Badge>
                                        </CardTitle>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {formatDate(order.created_at)} • ₱{order.total_price.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getPaymentStatusBadge(order.payment_status)}
                                        <Badge variant="outline">
                                            {order.payment_method === 'qr' ? <CreditCard className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                                            {order.payment_method === 'qr' ? 'QR Payment' : 'Cash'}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm">{order.customer_name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm">{order.customer_phone}</span>
                                    </div>
                                    {order.customer_email && (
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm">{order.customer_email}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        {order.pickup_or_delivery === 'delivery' ? (
                                            <Truck className="h-4 w-4 text-gray-500" />
                                        ) : (
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                        )}
                                        <span className="text-sm capitalize">{order.pickup_or_delivery}</span>
                                    </div>
                                    {order.scheduled_date && (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm">{formatDate(order.scheduled_date)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Order Items */}
                                <div className="mb-4">
                                    <h4 className="font-medium mb-2">Items ({order.order_items.length})</h4>
                                    <div className="space-y-1">
                                        {order.order_items.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center text-sm">
                                                <span>{item.product.name} × {item.quantity}</span>
                                                <span>₱{item.total_price.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment Proof Section */}
                                {order.payment_method === 'qr' && (
                                    <div className="border-t pt-4">
                                        <h4 className="font-medium mb-2 flex items-center gap-2">
                                            <FileImage className="h-4 w-4" />
                                            Payment Proof
                                        </h4>
                                        
                                        {order.payment_proof_path ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-600">
                                                        Submitted: {order.payment_submitted_at ? formatDate(order.payment_submitted_at) : 'N/A'}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => window.open(route('admin.orders.payment-proof', order.id), '_blank')}
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View Proof
                                                    </Button>
                                                    
                                                    {order.payment_status === 'submitted' && (
                                                        <>
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                onClick={() => handleApprovePayment(order.id)}
                                                            >
                                                                <Check className="h-4 w-4 mr-1" />
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedOrder(order);
                                                                    setShowRejectDialog(true);
                                                                }}
                                                            >
                                                                <X className="h-4 w-4 mr-1" />
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>

                                                {order.payment_status === 'approved' && order.payment_approved_at && (
                                                    <div className="text-sm text-green-600">
                                                        Approved on {formatDate(order.payment_approved_at)}
                                                        {order.payment_approver && ` by ${order.payment_approver.name}`}
                                                    </div>
                                                )}

                                                {order.payment_status === 'rejected' && order.payment_rejection_reason && (
                                                    <div className="text-sm text-red-600">
                                                        Rejected: {order.payment_rejection_reason}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">No payment proof uploaded yet</p>
                                        )}
                                    </div>
                                )}

                                {/* Status Update */}
                                <div className="border-t pt-4 mt-4">
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm font-medium">Update Status:</label>
                                        <Select 
                                            value={order.status} 
                                            onValueChange={(value) => handleStatusUpdate(order.id, value)}
                                        >
                                            <SelectTrigger className="w-48">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="payment_submitted">Payment Submitted</SelectItem>
                                                <SelectItem value="payment_approved">Payment Approved</SelectItem>
                                                <SelectItem value="payment_rejected">Payment Rejected</SelectItem>
                                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                                <SelectItem value="preparing">Preparing</SelectItem>
                                                <SelectItem value="ready">Ready</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                {orders.links && orders.links.length > 3 && (
                    <div className="flex justify-center">
                        <div className="flex space-x-1">
                            {orders.links.map((link: any, index: number) => (
                                <Button
                                    key={index}
                                    variant={link.active ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Reject Payment Dialog */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Payment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Please provide a reason for rejecting this payment proof:
                        </p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full p-3 border rounded-md"
                            rows={4}
                            placeholder="Enter rejection reason..."
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                                Cancel
                            </Button>
                            <Button 
                                variant="destructive" 
                                onClick={() => selectedOrder && handleRejectPayment(selectedOrder.id)}
                                disabled={!rejectionReason.trim()}
                            >
                                Reject Payment
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
