<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Relative;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'total_amount' => 'required|numeric|min:0',
            'paid_amount' => 'required|numeric|min:0',
            'balance_amount' => 'required|numeric|min:0',
            'order_status' => 'required|in:0,1,2',
            'invoiceDate' => 'nullable|date',
            'delivery_date' => 'nullable|date',
            'order_type' => 'required|in:1,2',
            'products' => 'required|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.product_size_id' => 'required|exists:product_sizes,id',
            'products.*.qty' => 'required|integer|min:1',
            'products.*.price' => 'required|numeric|min:0',
            'relatives' => 'nullable|array',
            'relatives.*.name' => 'required|string',
            'relatives.*.delivery_for' => 'required|string',
            'relatives.*.birthdate' => 'nullable|date',
            'discount' => 'nullable|numeric',
        ]);

        DB::beginTransaction();
        
        try {
            $order = Order::create($validated);

            foreach ($request->products as $product) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product['product_id'],
                    'product_size_id' => $product['product_size_id'],
                    'qty' => $product['qty'],
                    'price' => $product['price'],
                ]);
            }

            foreach ($request->relatives ?? [] as $relative) {
                Relative::create([
                    'customer_id' => $request->customer_id,
                    'name' => $relative['name'],
                    'delivery_for' => $relative['delivery_for'],
                    'order_id' => $order->id,
                    'birthdate' => $relative['birthdate'] ?? null,
                ]);
            }

            DB::commit();

            return response()->json(['message' => 'Order created successfully', 'order' => $order], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to create order', 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $order = Order::with([
                'orderItems.product',
                'orderItems.productSize',
                'relatives',
                'customer',
            ])->find($id);
    
            if (!$order) {
                return response()->json(['error' => 'Order not found'], 404);
            }
    
            return response()->json(['order' => $order], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch order', 'message' => $e->getMessage()], 500);
        }
    }
    
    public function index(Request $request)
    {
        try {
            $invoiceType = $request->query('orderType', null);
            $orderStatus = $request->query('orderStatus', null);
            $perPage = $request->query('perPage', 25);
            $page = $request->query('page', 1);

            $query = Order::with([
                'customer',
                'orderItems.product',
                'orderItems.productSize',
                'relatives'
            ]);

            if ($invoiceType != null) {
                if ($invoiceType == -1) {
                    $query->whereIn('order_type', [1, 2]);
                } else {
                    $query->where('order_type', $invoiceType);
                }
            }

            if ($orderStatus !== null) {
                $query->where('order_status', $orderStatus);
            }

            $orders = $query->paginate($perPage, ['*'], 'page', $page);

            return response()->json($orders, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch orders', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'order_status' => 'required|in:0,1,2',
        ]);

        try {
            $order = Order::findOrFail($id);
            $order->update([
                'order_status' => $validated['order_status'],
            ]);

            return response()->json(['message' => 'Order status updated successfully', 'order' => $order], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update order status', 'message' => $e->getMessage()], 500);
        }
    }

    public function updateBalance(Request $request, $id)
{
    $order = Order::findOrFail($id);

    // Validate that the 'balance_amount' is a numeric value and is greater than or equal to 0
    $request->validate([
        'balance_amount' => 'required|numeric|min:0',
    ]);

    // Convert both balance amounts to float for calculation
    $newBalanceAmount = (float) $request->balance_amount;
    $oldBalanceAmount = (float) $order->balance_amount;

    // Calculate the difference between the old and new balance amount
    $balanceDifference = $oldBalanceAmount - $newBalanceAmount;

    // Update the balance amount and paid amount
    $order->balance_amount = $newBalanceAmount;
    $order->paid_amount += $balanceDifference; // Add the difference to the paid amount

    // Save the updated order
    $order->save();

    return response()->json(['message' => 'Balance updated successfully', 'order' => $order]);
}



    public function markAsDelivered($id)
    {
        $order = Order::findOrFail($id);
        $order->order_status = 1;
        $order->save();

        return response()->json(['message' => 'Order marked as delivered', 'order' => $order]);
    }

    public function cancelOrder($id)
    {
        $order = Order::findOrFail($id);
        $order->order_status = 0;
        $order->save();

        return response()->json(['message' => 'Order canceled successfully', 'order' => $order]);
    }
}
