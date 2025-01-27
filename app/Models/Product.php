<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'multiSize', 'company_id'];

    /**
     * Define the relationship with the product sizes
     */
    public function sizes()
    {
        return $this->hasMany(ProductSize::class);
    }
}
