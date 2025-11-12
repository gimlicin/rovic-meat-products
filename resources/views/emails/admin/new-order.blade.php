@extends('emails.layout')

@section('title', 'New Order Received')

@section('content')
    <h2>New Order Received! 🔔</h2>
    
    <p>A new order has been placed on Rovic Meatshop.</p>
    
    <div class="alert alert-info">
        <strong>📦 Order Details</strong><br>
        Order #{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }} has been received and requires your attention.
    </div>
    
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
            <span class="order-info-label">Customer:</span>
            <span class="order-info-value">{{ $order->customer_name }}</span>
        </div>
        <div class="order-info-row">
            <span class="order-info-label">Contact:</span>
            <span class="order-info-value">{{ $order->customer_phone }}</span>
        </div>
        <div class="order-info-row">
            <span class="order-info-label">Email:</span>
            <span class="order-info-value">{{ $order->customer_email ?? 'Not provided' }}</span>
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
            <span class="order-info-label">Order Total:</span>
            <span class="order-info-value"><strong>₱{{ number_format($order->total_amount, 2) }}</strong></span>
        </div>
    </div>
    
    @if($order->delivery_address)
        <h3 style="margin-top: 30px; margin-bottom: 15px; color: #111827;">Delivery Address</h3>
        <div class="order-info">
            <p style="margin: 0;">{{ $order->delivery_address }}</p>
        </div>
    @endif
    
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
    
    @if($order->notes)
        <h3 style="margin-top: 30px; margin-bottom: 15px; color: #111827;">Customer Notes</h3>
        <div class="order-info">
            <p style="margin: 0;">{{ $order->notes }}</p>
        </div>
    @endif
    
    @if($order->payment_method === 'qr' && $order->payment_status === 'submitted')
        <div class="alert alert-warning">
            <strong>⚠️ Payment Proof Submitted</strong><br>
            The customer has uploaded payment proof. Please review and approve or reject the payment.
        </div>
    @elseif($order->payment_method === 'qr' && $order->payment_status === 'pending')
        <div class="alert alert-info">
            <strong>ℹ️ Awaiting Payment Proof</strong><br>
            The customer has not yet uploaded payment proof. Order is on hold until payment is received.
        </div>
    @else
        <div class="alert alert-success">
            <strong>✅ Cash Payment</strong><br>
            This is a cash payment order. You can proceed with preparation.
        </div>
    @endif
    
    <div style="text-align: center; margin-top: 30px;">
        <a href="{{ route('admin.orders.index') }}" class="button">
            View in Admin Panel
        </a>
    </div>
    
    <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
        Please process this order as soon as possible to ensure customer satisfaction.
    </p>
@endsection
