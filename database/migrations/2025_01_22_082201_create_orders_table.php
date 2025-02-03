<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('customers');
            $table->decimal('total_amount', 10, 2);
            $table->decimal('paid_amount', 10, 2)->default(0);
            $table->decimal('balance_amount', 10, 2)->default(0);
            $table->date('invoiceDate')->nullable();
            $table->tinyInteger('order_status')->default(0)->comment('0=pending, 1=delivered, 2=cancelled');
            $table->tinyInteger('order_type')->default(1)->comment('1=Regular, 2=Advance');
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('product_size_id')->constrained('product_sizes');
            $table->integer('qty');
            $table->decimal('price', 10, 2);
            $table->timestamps();
        });

        Schema::create('relatives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->string('name');
            $table->string('delivery_for');
            $table->date('birthdate')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('relatives');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
