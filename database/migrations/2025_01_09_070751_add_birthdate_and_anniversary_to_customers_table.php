<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddBirthdateAndAnniversaryToCustomersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->date('birthdate')->nullable()->after('mobile'); // Adjust column order as needed
            $table->date('anniversary_date')->nullable()->after('birthdate'); // Adjust column order as needed
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn(['birthdate', 'anniversary_date']);
        });
    }
}
