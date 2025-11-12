<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'address',
        'provider',
        'provider_id',
        'avatar',
        'provider_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'provider_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // User roles
    const ROLE_CUSTOMER = 'customer';
    const ROLE_WHOLESALER = 'wholesaler';
    const ROLE_ADMIN = 'admin';

    // Relationship with Orders
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    // Role helper methods
    public function isCustomer(): bool
    {
        return $this->role === self::ROLE_CUSTOMER;
    }

    public function isWholesaler(): bool
    {
        return $this->role === self::ROLE_WHOLESALER;
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    // Scopes for filtering
    public function scopeCustomers($query)
    {
        return $query->where('role', self::ROLE_CUSTOMER);
    }

    public function scopeWholesalers($query)
    {
        return $query->where('role', self::ROLE_WHOLESALER);
    }

    public function scopeAdmins($query)
    {
        return $query->where('role', self::ROLE_ADMIN);
    }
}
