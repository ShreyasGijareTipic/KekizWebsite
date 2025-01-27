<?php
namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Relative;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    protected $user;

    public function __construct()
    {
        $this->user = Auth::user();
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        // Validate the incoming request
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'total_amount' => 'required|numeric',
            'paid_amount' => 'required|numeric',
            'balance_amount' => 'required|numeric',
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.qty' => 'required|integer|min:1',
            'products.*.price' => 'required|numeric|min:0',
            'relatives' => 'required|array',
            'relatives.*.delivery_for' => 'nullable|string',
            'relatives.*.name' => 'required|string',
            'relatives.*.birthdate' => 'required|date',
        ]);

        try {
            // Start a database transaction
            \DB::beginTransaction();

            // Get the authenticated user
            $user = Auth::user();

            // Create the order associated with the user's company
            $order = Order::create([
                'customer_id' => $validated['customer_id'],
                'total_amount' => $validated['total_amount'],
                'paid_amount' => $validated['paid_amount'],
                'balance_amount' => $validated['balance_amount'],
                'company_id' => $user->company_id, // Associate order with the user's company
            ]);

            // Create relatives for the order
            $relativesData = collect($validated['relatives'])->map(function ($relative) use ($validated, $order) {
                return [
                    'customer_id' => $validated['customer_id'],
                    'delivery_for' => $relative['delivery_for'],
                    'name' => $relative['name'],
                    'birthdate' => $relative['birthdate'],
                    'order_id' => $order->id, // Link the relative to the order
                ];
            });

            Relative::insert($relativesData->toArray());

            // Create order details for each product
            $productsData = collect($validated['products'])->map(function ($product) use ($order) {
                return [
                    'order_id' => $order->id,
                    'product_id' => $product['product_id'],
                    'quantity' => $product['qty'],
                    'price' => $product['price'],
                    'total_price' => $product['qty'] * $product['price'],
                ];
            });

            OrderDetail::insert($productsData->toArray());

            // Commit the transaction
            \DB::commit();

            return response()->json(['message' => 'Order created successfully', 'order' => $order], 201);

        } catch (\Exception $e) {
            // Rollback the transaction in case of error
            \DB::rollBack();
            return response()->json(['message' => 'Error creating order', 'error' => $e->getMessage()], 500);
        }
    }
}
