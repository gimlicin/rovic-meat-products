<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'message',
        'type',
        'read',
        'order_id',
        'data',
        'read_at',
    ];

    protected $casts = [
        'read' => 'boolean',
        'data' => 'array',
        'read_at' => 'datetime',
    ];

    // Notification types
    const TYPE_ORDER = 'order';
    const TYPE_PAYMENT = 'payment';
    const TYPE_PROMOTION = 'promotion';
    const TYPE_SYSTEM = 'system';

    // Relationship with User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relationship with Order
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    // Scopes
    public function scopeUnread($query)
    {
        return $query->where('read', false);
    }

    public function scopeRead($query)
    {
        return $query->where('read', true);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    // Helper methods
    public function markAsRead(): void
    {
        $this->update([
            'read' => true,
            'read_at' => now(),
        ]);
    }

    public function markAsUnread(): void
    {
        $this->update([
            'read' => false,
            'read_at' => null,
        ]);
    }

    public function isRead(): bool
    {
        return $this->read;
    }

    public function isUnread(): bool
    {
        return !$this->read;
    }

    // Static methods for creating notifications
    public static function createOrderNotification(Order $order, string $title, string $message): self
    {
        return self::create([
            'user_id' => $order->user_id,
            'title' => $title,
            'message' => $message,
            'type' => self::TYPE_ORDER,
            'order_id' => $order->id,
            'data' => [
                'order_number' => $order->id,
                'total_amount' => $order->total_amount,
            ],
        ]);
    }

    public static function createPaymentNotification(Order $order, string $title, string $message): self
    {
        return self::create([
            'user_id' => $order->user_id,
            'title' => $title,
            'message' => $message,
            'type' => self::TYPE_PAYMENT,
            'order_id' => $order->id,
            'data' => [
                'order_number' => $order->id,
                'payment_method' => $order->payment_method,
                'total_amount' => $order->total_amount,
            ],
        ]);
    }

    public static function createPromotionNotification(?int $userId, string $title, string $message, array $data = []): self
    {
        return self::create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
            'type' => self::TYPE_PROMOTION,
            'data' => $data,
        ]);
    }

    public static function createSystemNotification(?int $userId, string $title, string $message, array $data = []): self
    {
        return self::create([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
            'type' => self::TYPE_SYSTEM,
            'data' => $data,
        ]);
    }
}
