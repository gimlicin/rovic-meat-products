<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // PostgreSQL has issues with enum modifications, so we convert to VARCHAR
        // which accepts any string value and is more flexible
        
        $driver = Schema::getConnection()->getDriverName();
        
        if ($driver === 'pgsql') {
            // Convert enum to VARCHAR for PostgreSQL
            DB::statement("ALTER TABLE orders ALTER COLUMN status TYPE VARCHAR(255)");
            DB::statement("ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'pending'");
            
            // Add a check constraint for valid status values (optional but recommended)
            DB::statement("
                DO $$ 
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM pg_constraint 
                        WHERE conname = 'orders_status_check'
                    ) THEN
                        ALTER TABLE orders ADD CONSTRAINT orders_status_check 
                        CHECK (status IN (
                            'pending', 'awaiting_payment', 'payment_submitted', 
                            'payment_approved', 'payment_rejected', 'confirmed', 
                            'preparing', 'ready', 'ready_for_pickup', 
                            'ready_for_delivery', 'completed', 'cancelled'
                        ));
                    END IF;
                END $$;
            ");
        } else {
            // For other databases (MySQL, SQLite), use standard Laravel method
            Schema::table('orders', function (Blueprint $table) {
                $table->enum('status', [
                    'pending', 
                    'awaiting_payment',
                    'payment_submitted', 
                    'payment_approved', 
                    'payment_rejected',
                    'confirmed', 
                    'preparing', 
                    'ready',
                    'ready_for_pickup', 
                    'ready_for_delivery', 
                    'completed', 
                    'cancelled'
                ])->default('pending')->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = Schema::getConnection()->getDriverName();
        
        if ($driver === 'pgsql') {
            // Drop the check constraint if it exists
            DB::statement("
                ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check
            ");
            
            // Keep as VARCHAR, no need to revert to enum
            DB::statement("ALTER TABLE orders ALTER COLUMN status TYPE VARCHAR(255)");
            DB::statement("ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'pending'");
        } else {
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
    }
};
