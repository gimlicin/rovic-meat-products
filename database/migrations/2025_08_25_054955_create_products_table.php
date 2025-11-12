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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->boolean('is_best_seller')->default(false);
            $table->string('image_url')->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->decimal('weight', 8, 2)->nullable();
            $table->string('unit')->default('kg'); // kg, lbs, pieces, etc.
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Indexes for better performance
            $table->index(['category_id', 'is_active']);
            $table->index('is_best_seller');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
