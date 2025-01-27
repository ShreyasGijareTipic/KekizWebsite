<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductSize;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    /**
     * Display a listing of the products with their sizes.
     */
    public function index()
    {
        $user = Auth::user();

        $products = Product::where('company_id', $user->company_id)->with('sizes')->get();

        return response()->json($products);
    }

    /**
     * Store a new product with multiple sizes.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'multiSize' => 'required|boolean',
            'sizes' => 'required|array',
            'sizes.*.size' => 'required|string',
            'sizes.*.qty' => 'required|integer|min:0',
            'sizes.*.oPrice' => 'required|numeric|min:0',
            'sizes.*.bPrice' => 'required|numeric|min:0',
        ]);
    
        $user = Auth::user();
    
        try {
            $product = Product::create([
                'name' => $request->name,
                'slug' => $request->slug ?? null,
                'multiSize' => $request->multiSize,
                'company_id' => $user->company_id,
            ]);
    
            $sizes = array_map(function ($size) use ($user, $product) {
                return [
                    'size' => $size['size'],
                    'qty' => $size['qty'],
                    'oPrice' => $size['oPrice'],
                    'bPrice' => $size['bPrice'],
                    'product_id' => $product->id,
                    'company_id' => $user->company_id,
                ];
            }, $request->sizes);
    
            ProductSize::insert($sizes);
    
            return response()->json($product->load('sizes'), 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create product', 'error' => $e->getMessage()], 500);
        }
    }
    

    /**
     * Update a product or its sizes.
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string',
            'multiSize' => 'sometimes|required|boolean',
            'sizes' => 'nullable|array',
            'sizes.*.id' => 'required|exists:product_sizes,id',
            'sizes.*.qty' => 'sometimes|integer|min:0',
            'sizes.*.oPrice' => 'sometimes|numeric|min:0',
            'sizes.*.bPrice' => 'sometimes|numeric|min:0',
        ]);

        // Update product fields
        if ($request->has('name')) {
            $product->name = $request->name;
        }
        if ($request->has('multiSize')) {
            $product->multiSize = $request->multiSize;
        }
        $product->save();

        // Update product sizes
        foreach ($request->sizes as $sizeData) {
            $size = ProductSize::find($sizeData['id']);
            if ($size) {
                if (isset($sizeData['qty'])) {
                    $size->qty = $sizeData['qty'];
                }
                if (isset($sizeData['oPrice'])) {
                    $size->oPrice = $sizeData['oPrice'];
                }
                if (isset($sizeData['bPrice'])) {
                    $size->bPrice = $sizeData['bPrice'];
                }
                $size->save();
            }
        }

        return response()->json($product->load('sizes'));
    }

    /**
     * Delete a specific size from product sizes.
     */
    public function destroySize($sizeId)
    {
        $size = ProductSize::find($sizeId);

        if (!$size) {
            return response()->json(['message' => 'Product size not found'], 404);
        }

        $size->delete();

        return response()->json(['message' => 'Product size deleted successfully']);
    }

    /**
     * Add new stock to a product size.
     */
    public function newStock(Request $request)
    {
        $request->validate([
            'sizes' => 'required|array',
            'sizes.*.id' => 'required|exists:product_sizes,id',
            'sizes.*.newStock' => 'required|integer|min:0',
        ]);

        foreach ($request->sizes as $sizeData) {
            $size = ProductSize::find($sizeData['id']);
            if ($size) {
                $size->increment('qty', $sizeData['newStock']);
            }
        }

        return response()->json(['message' => 'Stock updated successfully']);
    }

    public function updateSize($id, Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'size' => 'required|string',
            'qty' => 'required|integer',
            'oPrice' => 'required|numeric',
        ]);

        // Find the product size by ID
        $productSize = ProductSize::findOrFail($id);

        // Update the product size
        $productSize->size = $validated['size'];
        $productSize->qty = $validated['qty'];
        $productSize->oPrice = $validated['oPrice'];
        $productSize->save();

        // Return a response
        return response()->json([
            'message' => 'Product size updated successfully',
            'productSize' => $productSize,
        ]);
    }
}
