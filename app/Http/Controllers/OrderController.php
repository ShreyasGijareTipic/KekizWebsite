<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Relative;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon; // Correct import of Carbon

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
            'payment_type' => 'in:0,1',
            'company_id'=>'required|integer',
            'invoiceDate' => 'nullable|date',
            'delivery_date' => 'nullable|date',
            'order_type' => 'required|in:1,2',
            'products' => 'array',
            'products.*.product_id' => 'exists:products,id',
            'products.*.product_size_id' => 'exists:product_sizes,id',
            'products.*.qty' => 'integer|min:1',
            'products.*.price' => 'numeric|min:0',
            'relatives' => 'nullable|array',
            'relatives.*.name' => 'required|string',
            'relatives.*.delivery_for' => 'required|string',
            'relatives.*.birthdate' => 'nullable|date',
            'discount' => 'nullable|numeric',
            'custom_products' => 'nullable|array',  // Handle custom products as an array
            'custom_products.*.name' => 'required|string',
            'custom_products.*.size' => 'nullable|string',
            'custom_products.*.price' => 'required|numeric',
            'custom_products.*.qty' => 'required|integer',
            
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
    
        $request->validate([
            'balance_amount' => 'required|numeric|min:0',
        ]);
    
        $requestBalanceAmount = $request->balance_amount;
    
        // Subtract the request balance amount from the existing balance amount
        $order->balance_amount -= $requestBalanceAmount;
    
        // Add the request balance amount to the paid amount
        $order->paid_amount += $requestBalanceAmount;
    
        // Ensure that balance_amount does not exceed total_amount
        if ($order->balance_amount < 0) {
            return response()->json([
                'error' => 'Balance amount cannot be negative.',
            ], 400);
        }
    
        // Ensure that paid_amount does not exceed total_amount
        if ($order->paid_amount > $order->total_amount) {
            return response()->json([
                'error' => 'Paid amount cannot exceed total amount.',
            ], 400);
        }
    
        $order->save();
    
        return response()->json([
            'message' => 'Balance and Paid amount updated successfully',
            'data' => $order,
        ]);
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

    public function fetchSales(Request $request)
    {
        try {
            $user = Auth::user(); // Get the authenticated user
            $startDate = $request->input('startDate'); // Get start date from query parameters
            $endDate = $request->input('endDate'); // Get end date from query parameters

            // Validate date inputs (if provided)
            $validated = $request->validate([
                'startDate' => 'nullable|date',
                'endDate' => 'nullable|date',
            ]);

            // Create the query to fetch orders from the database
            $query = Order::where('order_status', 1) // Only delivered orders
                ->where('company_id', $user->company_id); // Only orders for the authenticated user's company

            // Apply date filters if provided
            if (!empty($startDate) && !empty($endDate)) {
                $query->whereBetween('invoiceDate', [$startDate, $endDate]);
            }

            // Get the orders
            $orders = $query->get();

            // Group orders by invoice date and calculate totalAmount, paidAmount, remainingAmount
            $groupedSales = $orders->groupBy('invoiceDate')->map(function ($items) {
                return [
                    'invoiceDate' => $items->first()->invoiceDate,
                    'totalAmount' => $items->sum('totalAmount'),
                    'paidAmount' => $items->sum('paidAmount'),
                ];
            });

            // Map the grouped sales to include remainingAmount
            $salesData = $groupedSales->map(function ($sale) {
                $sale['remainingAmount'] = $sale['totalAmount'] - $sale['paidAmount'];
                return $sale;
            });

            // Return the sales data
            return response()->json([
                'message' => 'Sales data fetched successfully',
                'data' => $salesData
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch sales data',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function Sales(Request $request)
    {
        try {
            $user = Auth::user(); // Get the authenticated user
            $startDate = $request->query('startDate'); // Get start date from query parameters
            $endDate = $request->query('endDate'); // Get end date from query parameters
    
            // Create the query to fetch orders from the database
            $query = Order::whereNotIn('order_status', [0, 2]) // Exclude canceled and pending orders
                          ->where('company_id', $user->company_id) // Filter by user's company
                          ->where('order_status', 1); // Only fetch delivered orders
    
            // Apply date filters if provided
            if ($startDate && $endDate) {
                $query->whereBetween('invoiceDate', [$startDate, $endDate]);
            }
    
            // Get the result of the query
            $result = $query->get();
    
            // Check if the result is empty
            if ($result->isEmpty()) {
                return response()->json(['message' => 'No sales data found for the given date range.'], 404);
            }
    
            // Format the data to ensure numerical consistency and proper date format
            $formattedResult = $result->map(function ($order) {
                return [
                    'id' => $order->id,
                    'customer_id' => $order->customer_id,
                    'total_amount' => number_format($order->total_amount, 2, '.', ''), // Ensure two decimal places
                    'paid_amount' => number_format($order->paid_amount, 2, '.', ''),
                    'balance_amount' => number_format($order->balance_amount, 2, '.', ''),
                    'invoiceDate' => Carbon::parse($order->invoiceDate)->format('Y-m-d'), // Format the date
                    'order_status' => $order->order_status,
                    'order_type' => $order->order_type,
                    'discount' => $order->discount,
                    'company_id' => $order->company_id,
                    'created_at' => $order->created_at->toDateTimeString(),
                    'updated_at' => $order->updated_at->toDateTimeString(),
                ];
            });
    
            return response()->json($formattedResult);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch sales data', 'message' => $e->getMessage()], 500);
        }
    }

    public function getSalesReport(Request $request)
{
    $startDate = $request->query('startDate');
    $endDate = $request->query('endDate');
    $companyId = $request->query('company_id');

    if (!$startDate || !$endDate || !$companyId) {
        return response()->json(['error' => 'Start date, end date, and company ID are required'], 400);
    }

    $sales = DB::table('orders')
        ->whereBetween('invoiceDate', [$startDate, $endDate])
        ->where('company_id', $companyId)
        ->select(
            'invoiceDate',
            DB::raw('SUM(total_amount) as totalAmount'),
            DB::raw('SUM(paid_amount) as paidAmount'),
            DB::raw('SUM(balance_amount) as balanceAmount')
        )
        ->groupBy('invoiceDate')
        ->orderBy('invoiceDate', 'asc')
        ->get();

    return response()->json([
        'message' => 'Sales data fetched successfully',
        'data' => $sales
    ], 200);
}


    
public function getProfitLossReport(Request $request)
{
    $startDate = $request->query('startDate');
    $endDate = $request->query('endDate');
    $companyId = $request->query('company_id');

    if (!$startDate || !$endDate || !$companyId) {
        return response()->json(['error' => 'Start date, end date, and company ID are required'], 400);
    }

    // Fetch sales data
    $salesData = DB::table('orders')
        ->whereBetween('invoiceDate', [$startDate, $endDate])
        ->where('company_id', $companyId)
        ->select('invoiceDate as date', DB::raw('SUM(total_amount) as totalSales'))
        ->groupBy('invoiceDate')
        ->get()
        ->keyBy('date');

    // Fetch expense data
    $expenseData = DB::table('expenses')
        ->whereBetween('expense_date', [$startDate, $endDate])
        ->where('company_id', $companyId)
        ->select('expense_date as date', DB::raw('SUM(total_price) as totalExpenses'))
        ->groupBy('expense_date')
        ->get()
        ->keyBy('date');

    // Merge sales and expenses into a single report
    $dates = $salesData->keys()->merge($expenseData->keys())->unique()->sort();

    $reportData = $dates->map(function ($date) use ($salesData, $expenseData) {
        $totalSales = isset($salesData[$date]) ? (float) $salesData[$date]->totalSales : 0;
        $totalExpenses = isset($expenseData[$date]) ? (float) $expenseData[$date]->totalExpenses : 0;

        return [
            'date' => $date,
            'totalSales' => $totalSales,
            'totalExpenses' => $totalExpenses,
            'profitOrLoss' => round($totalSales - $totalExpenses, 2),
        ];
    });

    return response()->json($reportData->values());
}


}
