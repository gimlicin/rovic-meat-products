import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ShopFrontLayout from '@/layouts/shop-front-layout';

export default function TrackOrder() {
    const { data, setData, post, processing, errors } = useForm({
        order_id: '',
        customer_email: '',
        customer_phone: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('orders.track.submit'));
    };

    return (
        <ShopFrontLayout>
            <Head title="Track Your Order - Rovic Meatshop" />
            
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-md mx-auto px-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Track Your Order</CardTitle>
                            <CardDescription>
                                Enter your order details to view your order status
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="order_id">Order ID *</Label>
                                    <Input
                                        id="order_id"
                                        type="number"
                                        value={data.order_id}
                                        onChange={(e) => setData('order_id', e.target.value)}
                                        placeholder="Enter your order ID"
                                        required
                                    />
                                    {errors.order_id && (
                                        <p className="text-sm text-red-600">{errors.order_id}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="customer_email">Email Address</Label>
                                    <Input
                                        id="customer_email"
                                        type="email"
                                        value={data.customer_email}
                                        onChange={(e) => setData('customer_email', e.target.value)}
                                        placeholder="Enter your email"
                                    />
                                    {errors.customer_email && (
                                        <p className="text-sm text-red-600">{errors.customer_email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="customer_phone">Phone Number</Label>
                                    <Input
                                        id="customer_phone"
                                        type="tel"
                                        value={data.customer_phone}
                                        onChange={(e) => setData('customer_phone', e.target.value)}
                                        placeholder="Enter your phone number"
                                    />
                                    {errors.customer_phone && (
                                        <p className="text-sm text-red-600">{errors.customer_phone}</p>
                                    )}
                                    <p className="text-xs text-gray-500">
                                        * Enter either email or phone number used during checkout
                                    </p>
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full"
                                    disabled={processing}
                                >
                                    {processing ? 'Searching...' : 'Track Order'}
                                </Button>
                            </form>

                            <div className="mt-6 pt-6 border-t">
                                <p className="text-sm text-gray-600 text-center">
                                    Your Order ID was provided after checkout. 
                                    If you can't find it, please contact our support.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ShopFrontLayout>
    );
}
