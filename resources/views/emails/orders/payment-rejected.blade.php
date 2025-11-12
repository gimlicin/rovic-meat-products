@extends('emails.layout')

@section('title', 'Payment Update Required')

@section('content')
    <h2>Payment Proof Needs Attention</h2>
    
    <p>Hi {{ $order->customer_name }},</p>
    
    <p>We've reviewed your payment proof for Order #{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}, but unfortunately we couldn't verify it.</p>
    
    <div class="alert alert-warning">
        <strong>⚠️ Action Required</strong><br>
        Please submit a new payment proof to proceed with your order.
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
    </div>
    
    <h3 style="margin-top: 30px; margin-bottom: 15px; color: #111827;">Reason for Rejection</h3>
    
    <div class="order-info">
        <p style="margin: 0; color: #dc2626;">{{ $rejectionReason }}</p>
    </div>
    
    <h3 style="margin-top: 30px; margin-bottom: 15px; color: #111827;">What You Need to Do:</h3>
    
    <ol style="line-height: 2; color: #4b5563;">
        <li>Make sure your payment screenshot is clear and readable</li>
        <li>Verify that the payment amount matches your order total</li>
        <li>Include the transaction reference number if applicable</li>
        <li>Submit your new payment proof through your order page</li>
    </ol>
    
    @if($order->user_id)
        <div style="text-align: center; margin-top: 30px;">
            <a href="{{ route('orders.show', $order) }}" class="button">
                Upload New Payment Proof
            </a>
        </div>
    @else
        <div class="alert alert-info">
            <strong>📋 Need Help?</strong><br>
            Please visit our website and use your Order Number <strong>#{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</strong> to upload a new payment proof.
        </div>
    @endif
    
    <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
        If you have any questions or need assistance, please don't hesitate to contact us. We're here to help!
    </p>
    
    <p style="margin-top: 20px;">
        Thank you for your understanding,<br>
        <strong>The Rovic Meatshop Team</strong>
    </p>
@endsection
