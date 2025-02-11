<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->tinyInteger('payment_type')->default(0)->comment('0: Cash, 1: Online/UPI')->after('order_status');
        });
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('payment_type');
        });
    }
};
