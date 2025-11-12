<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Modify the status enum to include new pickup/delivery statuses
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('status', [
                'pending', 
                'awaiting_payment',
                'payment_submitted', 
                'payment_approved', 
                'payment_rejected',
                'confirmed', 
                'preparing', 
                'ready',  // Keep for backward compatibility
                'ready_for_pickup', 
                'ready_for_delivery', 
                'completed', 
                'cancelled'
            ])->default('pending')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to original enum values
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('status', [
                'pending', 
                'confirmed', 
                'preparing', 
                'ready', 
                'completed', 
                'cancelled'
            ])->default('pending')->change();
        });
    }
};
