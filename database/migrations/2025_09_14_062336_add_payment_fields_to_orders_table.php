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
            $table->enum('payment_method', ['qr', 'cash'])->default('qr')->after('is_bulk_order');
            $table->string('payment_proof_path')->nullable()->after('payment_method');
            $table->enum('payment_status', ['pending', 'submitted', 'approved', 'rejected'])->default('pending')->after('payment_proof_path');
            $table->text('payment_rejection_reason')->nullable()->after('payment_status');
            $table->timestamp('payment_submitted_at')->nullable()->after('payment_rejection_reason');
            $table->timestamp('payment_approved_at')->nullable()->after('payment_submitted_at');
            $table->foreignId('payment_approved_by')->nullable()->constrained('users')->after('payment_approved_at');
            
            // Update status enum to include new payment-related statuses
            $table->enum('status', ['pending', 'awaiting_payment', 'payment_submitted', 'payment_approved', 'payment_rejected', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'])
                  ->default('pending')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['payment_approved_by']);
            $table->dropColumn([
                'payment_method',
                'payment_proof_path',
                'payment_status',
                'payment_rejection_reason',
                'payment_submitted_at',
                'payment_approved_at',
                'payment_approved_by'
            ]);
            
            // Revert status enum to original values
            $table->enum('status', ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'])
                  ->default('pending')->change();
        });
    }
};
