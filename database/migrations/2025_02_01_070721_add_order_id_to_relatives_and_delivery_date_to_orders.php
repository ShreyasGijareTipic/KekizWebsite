<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        // Add `order_id` to the `relatives` table
        Schema::table('relatives', function (Blueprint $table) {
            $table->foreignId('order_id')->nullable()->constrained('orders')->onDelete('cascade');
        });

        // Add `delivery_date` to the `orders` table
        Schema::table('orders', function (Blueprint $table) {
            $table->date('delivery_date')->nullable()->after('invoiceDate');
        });
    }

    public function down()
    {
        // Remove `order_id` from the `relatives` table
        Schema::table('relatives', function (Blueprint $table) {
            $table->dropColumn('order_id');
        });

        // Remove `delivery_date` from the `orders` table
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('delivery_date');
        });
    }
};
