<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'stock_quantity',
        'max_order_quantity',
        'low_stock_threshold',
        'track_stock',
        'reserved_stock',
        'category_id',
        'image_url',
        'is_active',
        'is_best_selling',
        'is_promo',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_best_selling' => 'boolean',
        'is_promo' => 'boolean',
        'is_active' => 'boolean',
        'stock_quantity' => 'integer',
        'max_order_quantity' => 'integer',
        'low_stock_threshold' => 'integer',
        'track_stock' => 'boolean',
        'reserved_stock' => 'integer',
        'weight' => 'decimal:2',
    ];

    protected $appends = ['formatted_price'];

    // Accessor for formatted price
    public function getFormattedPriceAttribute(): string
    {
        return '₱' . number_format($this->price, 2);
    }

    // Relationship with Category
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // Relationship with Order Items
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // Scopes for filtering
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeBestSelling($query)
    {
        return $query->where('is_best_selling', true);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeLowStock($query)
    {
        return $query->whereColumn('stock_quantity', '<=', 'low_stock_threshold')
                    ->where('track_stock', true);
    }

    // Stock management methods
    public function getAvailableStock(): int
    {
        if (!$this->track_stock) {
            return PHP_INT_MAX;
        }
        
        return max(0, $this->stock_quantity - $this->reserved_stock);
    }

    public function getMaxOrderableQuantity(): int
    {
        if (!$this->track_stock) {
            return $this->max_order_quantity;
        }
        
        return min($this->getAvailableStock(), $this->max_order_quantity);
    }

    public function isLowStock(): bool
    {
        if (!$this->track_stock) {
            return false;
        }
        
        return $this->stock_quantity <= $this->low_stock_threshold;
    }

    public function isOutOfStock(): bool
    {
        if (!$this->track_stock) {
            return false;
        }
        
        return $this->getAvailableStock() <= 0;
    }

    public function canFulfillQuantity(int $quantity): bool
    {
        if (!$this->track_stock) {
            return $quantity <= $this->max_order_quantity;
        }
        
        return $quantity <= $this->getMaxOrderableQuantity();
    }

    public function reserveStock(int $quantity): bool
    {
        if (!$this->track_stock) {
            return true;
        }
        
        if (!$this->canFulfillQuantity($quantity)) {
            return false;
        }
        
        $this->increment('reserved_stock', $quantity);
        return true;
    }

    public function releaseStock(int $quantity): void
    {
        if (!$this->track_stock) {
            return;
        }
        
        $this->decrement('reserved_stock', min($quantity, $this->reserved_stock));
    }

    public function deductStock(int $quantity): bool
    {
        if (!$this->track_stock) {
            return true;
        }
        
        if ($this->stock_quantity < $quantity) {
            return false;
        }
        
        $this->decrement('stock_quantity', $quantity);
        $this->decrement('reserved_stock', min($quantity, $this->reserved_stock));
        return true;
    }
}
