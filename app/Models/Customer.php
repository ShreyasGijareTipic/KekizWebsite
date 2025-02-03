<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;
    protected $fillable=[
        'name',
        'mobile',
        'show',
        'birthdate',
        'anniversary_date',
        'company_id',
        'created_by',
        'updated_by'
    ];

    public function paymentTracker()
    {
        return $this->hasOne(PaymentTracker::class, 'customer_id');
    }
    public function relatives()
{
    return $this->hasMany(Relative::class, 'customer_id');
}

    public function jarTrackers()
    {
        return $this->hasMany(JarTracker::class, 'customer_id');
    }

    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}
