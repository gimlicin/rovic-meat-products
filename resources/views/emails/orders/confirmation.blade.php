@extends('emails.layout')

@section('title', 'Order Confirmation')

@section('content')
    <h2>Thank You for Your Order!</h2>
    
    <p>Hi {{ $order->customer_name }},</p>
    
    <p>We've received your order and are getting it ready. Below are the details of your order:</p>
    
    <div class="order-info">
        <div class="order-info-row">
            <span class="order-info-label">Order Number:</span>
            <span class="order-info-value">#{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</span>
        </div>
        <div class="order-info-row">
            <span class="order-info-label">Order Date:</span>
            <span class="order-info-value">{{ $order->created_at->format('M d, Y h:i A') }}</span>
        </div>
        <div class="order-info-row">
            <span class="order-info-label">Delivery Method:</span>
            <span class="order-info-value">{{ ucfirst($order->pickup_or_delivery) }}</span>
        </div>
        <div class="order-info-row">
            <span class="order-info-label">Payment Method:</span>
            <span class="order-info-value">{{ $order->payment_method === 'cash' ? 'Cash on Delivery/Pickup' : 'QR Code Payment' }}</span>
        </div>
        <div class="order-info-row">
            <span class="order-info-label">Status:</span>
            <span class="order-info-value">
                <span class="status-badge status-{{ $order->status }}">
                    {{ ucfirst(str_replace('_', ' ', $order->status)) }}
                </span>
            </span>
        </div>
    </div>
    
    <h3 style="margin-top: 30px; margin-bottom: 15px; color: #111827;">Order Items</h3>
    
    <table class="items-table">
        <thead>
            <tr>
                <th>Product</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($orderItems as $item)
                <tr>
                    <td>{{ $item->product->name ?? 'Product' }}</td>
                    <td style="text-align: center;">{{ $item->quantity }}</td>
                    <td style="text-align: right;">₱{{ number_format($item->price, 2) }}</td>
                    <td style="text-align: right;">₱{{ number_format($item->total_price, 2) }}</td>
                </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="3" style="text-align: right; padding-right: 15px;">Total Amount:</td>
                <td style="text-align: right;">₱{{ number_format($order->total_amount, 2) }}</td>
            </tr>
        </tbody>
    </table>
    
    @if($order->payment_method === 'qr' && $order->payment_status === 'pending')
        <div class="alert alert-warning">
            <strong>⚠️ Payment Required</strong><br>
            Please submit your payment proof to process your order. You can upload your payment screenshot in your order details page.
        </div>
    @elseif($order->payment_method === 'qr' && $order->payment_status === 'submitted')
        <div class="alert alert-info">
            <strong>ℹ️ Payment Submitted</strong><br>
            We've received your payment proof and it's currently being reviewed. You'll receive a confirmation email once approved.
        </div>
    @else
        <div class="alert alert-success">
            <strong>✅ Order Confirmed</strong><br>
            Your order has been confirmed and will be prepared soon. We'll notify you when it's ready!
        </div>
    @endif
    
    @if($order->delivery_address)
        <h3 style="margin-top: 30px; margin-bottom: 15px; color: #111827;">Delivery Address</h3>
        <div class="order-info">
            <p style="margin: 0;">{{ $order->delivery_address }}</p>
        </div>
    @endif
    
    @if($order->notes)
        <h3 style="margin-top: 30px; margin-bottom: 15px; color: #111827;">Order Notes</h3>
        <div class="order-info">
            <p style="margin: 0;">{{ $order->notes }}</p>
        </div>
    @endif
    
    @if($order->user_id)
        <div style="text-align: center; margin-top: 30px;">
            <a href="{{ route('orders.show', $order) }}" class="button">
                View Order Details
            </a>
        </div>
    @else
        <div class="alert alert-info">
            <strong>📋 Track Your Order</strong><br>
            Save your Order Number: <strong>#{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</strong><br>
            You can track your order anytime using this number and your contact information on our website.
        </div>
    @endif
    
    <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
        If you have any questions about your order, please don't hesitate to contact us at {{ $order->customer_phone }}.
    </p>
    
    <p style="margin-top: 20px;">
        Thank you for choosing Rovic Meatshop!<br>
        <strong>The Rovic Meatshop Team</strong>
    </p>
@endsection
