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
        Schema::create('hotels', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('address');
            $table->string('address2')->nullable();
            $table->string('zipcode');
            $table->string('city');
            $table->string('country');
            $table->float('longitude');
            $table->float('latitude');
            $table->text('description');
            $table->integer('max_capacity')->unsigned();
            $table->float('price_per_night');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotels');
    }
};
