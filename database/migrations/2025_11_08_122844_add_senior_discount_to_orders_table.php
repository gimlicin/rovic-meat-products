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
        Schema::table('orders', function (Blueprint $table) {
            $table->boolean('is_senior_discount')->default(false)->after('total_amount');
            $table->string('discount_type', 50)->nullable()->after('is_senior_discount');
            $table->decimal('discount_amount', 10, 2)->default(0)->after('discount_type');
            $table->boolean('senior_id_verified')->default(false)->after('discount_amount');
            $table->text('verification_notes')->nullable()->after('senior_id_verified');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'is_senior_discount',
                'discount_type',
                'discount_amount',
                'senior_id_verified',
                'verification_notes'
            ]);
        });
    }
};
