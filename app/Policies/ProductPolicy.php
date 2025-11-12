<?php

namespace App\Policies;

use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    /**
     * Determine whether the user can view any products.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view products
        return true;
    }

    /**
     * Determine whether the user can view the product.
     */
    public function view(?User $user, Product $product): bool
    {
        // Anyone can view active products, only admins can view inactive
        return $product->is_active || ($user && $user->isAdmin());
    }

    /**
     * Determine whether the user can create products.
     */
    public function create(User $user): bool
    {
        // Only admins can create products
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can update the product.
     */
    public function update(User $user, Product $product): bool
    {
        // Only admins can update products
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can delete the product.
     */
    public function delete(User $user, Product $product): bool
    {
        // Only admins can delete products
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can restore the product.
     */
    public function restore(User $user, Product $product): bool
    {
        // Only admins can restore products
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can permanently delete the product.
     */
    public function forceDelete(User $user, Product $product): bool
    {
        // Only admins can force delete products
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can toggle best seller status.
     */
    public function toggleBestSeller(User $user, Product $product): bool
    {
        // Only admins can toggle best seller status
        return $user->isAdmin();
    }
}
