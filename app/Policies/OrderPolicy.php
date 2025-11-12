<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    /**
     * Determine whether the user can view any orders.
     */
    public function viewAny(User $user): bool
    {
        // Admins can view all orders, customers can view their own
        return $user->isAdmin() || $user->isCustomer() || $user->isWholesaler();
    }

    /**
     * Determine whether the user can view the order.
     */
    public function view(User $user, Order $order): bool
    {
        // Admins can view any order, users can view their own orders
        return $user->isAdmin() || $order->user_id === $user->id;
    }

    /**
     * Determine whether the user can create orders.
     */
    public function create(User $user): bool
    {
        // All authenticated users can create orders
        return true;
    }

    /**
     * Determine whether the user can update the order.
     */
    public function update(User $user, Order $order): bool
    {
        // Admins can update any order, customers can update their pending orders
        if ($user->isAdmin()) {
            return true;
        }

        return $order->user_id === $user->id && $order->status === Order::STATUS_PENDING;
    }

    /**
     * Determine whether the user can delete the order.
     */
    public function delete(User $user, Order $order): bool
    {
        // Only admins can delete orders
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can cancel the order.
     */
    public function cancel(User $user, Order $order): bool
    {
        // Admins can cancel any order, customers can cancel their own pending/confirmed orders
        if ($user->isAdmin()) {
            return true;
        }

        return $order->user_id === $user->id && 
               in_array($order->status, [Order::STATUS_PENDING, Order::STATUS_CONFIRMED]);
    }

    /**
     * Determine whether the user can update order status.
     */
    public function updateStatus(User $user, Order $order): bool
    {
        // Only admins can update order status
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can reorder.
     */
    public function reorder(User $user, Order $order): bool
    {
        // Users can reorder their own completed orders
        return $order->user_id === $user->id && $order->status === Order::STATUS_COMPLETED;
    }
}
