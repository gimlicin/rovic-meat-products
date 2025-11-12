<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price',
        'total_price',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    // Relationship with Order
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    // Relationship with Product
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    // Calculate total price automatically
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($orderItem) {
            $orderItem->total_price = $orderItem->quantity * $orderItem->price;
        });
    }
}
