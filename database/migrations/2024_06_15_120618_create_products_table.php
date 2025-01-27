<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');  // Product name
            $table->string('slug')->nullable();  // Slug for the product (used for SEO, URL)
            $table->boolean('multiSize')->default(false);  // Whether the product has multiple sizes
            $table->integer('company_id');  // Company associated with the product
            $table->timestamps();
        });

       
        Schema::create('product_sizes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id');  // Foreign key to products table
            $table->string('size');  // Size name (e.g., 500 gm, 1 kg)
            $table->integer('qty')->default(0);    // Available quantity for the size
            $table->double('oPrice')->default(0);  // Selling price for the size
            $table->double('bPrice')->default(0);  // Base price for the size
            $table->integer('company_id');  // Company associated with the size
            $table->timestamps();

            // Foreign key relationship with products table
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    

    }

    public function down()
    {
        Schema::dropIfExists('products');
        Schema::dropIfExists('product_sizes');

    }
}
