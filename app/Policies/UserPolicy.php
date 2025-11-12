<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine whether the user can view any users.
     */
    public function viewAny(User $user): bool
    {
        // Only admins can view all users
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can view the user.
     */
    public function view(User $user, User $model): bool
    {
        // Admins can view any user, users can view their own profile
        return $user->isAdmin() || $user->id === $model->id;
    }

    /**
     * Determine whether the user can create users.
     */
    public function create(User $user): bool
    {
        // Only admins can create users
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can update the user.
     */
    public function update(User $user, User $model): bool
    {
        // Admins can update any user, users can update their own profile
        return $user->isAdmin() || $user->id === $model->id;
    }

    /**
     * Determine whether the user can delete the user.
     */
    public function delete(User $user, User $model): bool
    {
        // Only admins can delete users, but not themselves
        return $user->isAdmin() && $user->id !== $model->id;
    }

    /**
     * Determine whether the user can change roles.
     */
    public function changeRole(User $user, User $model): bool
    {
        // Only admins can change user roles, but not their own
        return $user->isAdmin() && $user->id !== $model->id;
    }
}
