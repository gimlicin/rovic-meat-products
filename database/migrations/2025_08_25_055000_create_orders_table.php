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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('status', ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'])
                  ->default('pending');
            $table->decimal('total_price', 10, 2);
            $table->enum('pickup_or_delivery', ['pickup', 'delivery']);
            $table->text('notes')->nullable();
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_email')->nullable();
            $table->text('delivery_address')->nullable();
            $table->datetime('scheduled_date')->nullable();
            $table->boolean('is_bulk_order')->default(false);
            $table->timestamps();

            // Indexes for better performance
            $table->index(['status', 'created_at']);
            $table->index('pickup_or_delivery');
            $table->index('is_bulk_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
