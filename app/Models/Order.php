<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = ['customer_id', 'total_amount', 'paid_amount', 'balance_amount','order_status', 'discount','order_type','invoiceDate','delivery_date'];

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function relatives()
    {
        return $this->hasMany(Relative::class);
    }
    public function customer()
{
    return $this->belongsTo(Customer::class, 'customer_id');
}

}