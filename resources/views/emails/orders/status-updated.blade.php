@extends('emails.layout')

@section('title', 'Order Status Update')

@section('content')
    <h2>Order Status Updated</h2>
    
    <p>Hi {{ $order->customer_name }},</p>
    
    <p>{{ $statusMessage }}</p>
    
    <div class="order-info">
        <div class="order-info-row">
            <span class="order-info-label">Order Number:</span>
            <span class="order-info-value">#{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</span>
        </div>
        <div class="order-info-row">
            <span class="order-info-label">Current Status:</span>
            <span class="order-info-value">
                <span class="status-badge status-{{ $order->status }}">
                    {{ ucfirst(str_replace('_', ' ', $order->status)) }}
                </span>
            </span>
        </div>
        <div class="order-info-row">
            <span class="order-info-label">Order Total:</span>
            <span class="order-info-value">₱{{ number_format($order->total_amount, 2) }}</span>
        </div>
    </div>
    
    @if($order->status === 'preparing')
        <div class="alert alert-info">
            <strong>👨‍🍳 Order Being Prepared</strong><br>
            Your order is currently being prepared with care. We'll notify you when it's ready for {{ $order->pickup_or_delivery }}!
        </div>
    @elseif($order->status === 'ready')
        <div class="alert alert-success">
            <strong>✅ Order Ready for {{ ucfirst($order->pickup_or_delivery) }}</strong><br>
            Great news! Your order is ready. Please proceed to pick it up or expect delivery soon.
            @if($order->delivery_address)
                <br><br><strong>Delivery Address:</strong><br>{{ $order->delivery_address }}
            @endif
        </div>
    @elseif($order->status === 'completed')
        <div class="alert alert-success">
            <strong>🎉 Order Completed</strong><br>
            Thank you for your purchase! We hope you enjoy our products. We'd love to serve you again soon!
        </div>
    @endif
    
    @if($order->user_id)
        <div style="text-align: center; margin-top: 30px;">
            <a href="{{ route('orders.show', $order) }}" class="button">
                View Order Details
            </a>
        </div>
    @endif
    
    <p style="margin-top: 30px;">
        Thank you for choosing Rovic Meatshop!<br>
        <strong>The Rovic Meatshop Team</strong>
    </p>
@endsection
