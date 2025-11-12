@extends('emails.layout')

@section('title', 'Payment Approved')

@section('content')
    <h2>Payment Approved! 🎉</h2>
    
    <p>Hi {{ $order->customer_name }},</p>
    
    <p>Great news! Your payment has been verified and approved. Your order is now confirmed and will be prepared soon.</p>
    
    <div class="alert alert-success">
        <strong>✅ Payment Approved</strong><br>
        Your payment of <strong>₱{{ number_format($order->total_amount, 2) }}</strong> has been successfully verified.<br>
        Approved on: {{ now()->format('M d, Y h:i A') }}
    </div>
    
    <div class="order-info">
        <div class="order-info-row">
            <span class="order-info-label">Order Number:</span>
            <span class="order-info-value">#{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</span>
        </div>
        <div class="order-info-row">
            <span class="order-info-label">Order Total:</span>
            <span class="order-info-value">₱{{ number_format($order->total_amount, 2) }}</span>
        </div>
        <div class="order-info-row">
            <span class="order-info-label">Payment Status:</span>
            <span class="order-info-value">
                <span class="status-badge status-confirmed">Approved</span>
            </span>
        </div>
        <div class="order-info-row">
            <span class="order-info-label">Delivery Method:</span>
            <span class="order-info-value">{{ ucfirst($order->pickup_or_delivery) }}</span>
        </div>
    </div>
    
    <h3 style="margin-top: 30px; margin-bottom: 15px; color: #111827;">What Happens Next?</h3>
    
    <ol style="line-height: 2; color: #4b5563;">
        <li>Your order will be prepared by our team</li>
        <li>You'll receive another email when your order is ready</li>
        <li>You can then {{ $order->pickup_or_delivery === 'pickup' ? 'pick up your order' : 'expect delivery' }}</li>
    </ol>
    
    @if($order->user_id)
        <div style="text-align: center; margin-top: 30px;">
            <a href="{{ route('orders.show', $order) }}" class="button">
                Track Your Order
            </a>
        </div>
    @endif
    
    <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
        We'll keep you updated on your order progress via email. Thank you for your patience!
    </p>
    
    <p style="margin-top: 20px;">
        Thank you for choosing Rovic Meatshop!<br>
        <strong>The Rovic Meatshop Team</strong>
    </p>
@endsection
