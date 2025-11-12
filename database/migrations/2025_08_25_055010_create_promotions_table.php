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
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->datetime('start_date')->nullable();
            $table->datetime('end_date')->nullable();
            $table->decimal('discount_percentage', 5, 2)->nullable(); // e.g., 15.50%
            $table->decimal('discount_amount', 10, 2)->nullable(); // e.g., ₱50.00
            $table->integer('priority')->default(0); // Higher number = higher priority
            $table->timestamps();

            // Indexes for better performance
            $table->index(['is_active', 'priority']);
            $table->index(['start_date', 'end_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
