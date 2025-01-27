<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\SubSubCategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\JarTrackerController;
use App\Http\Controllers\ExpenseTypeController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\FileUpload;
use App\Http\Controllers\CustomerController;
use App\Http\Middleware\Authorization;
use App\Http\Controllers\CompanyInfoController;
use App\Http\Controllers\PaymentTrackerController; // Added controller

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

Route::post('/orders', [OrderController::class, 'store'])->middleware('auth:sanctum');

//public API's
Route::post('/register',[AuthController::class, 'register']);
Route::post('/login',[AuthController::class, 'login']);
Route::post('/mobileLogin',[AuthController::class, 'mobileLogin']);


//Secured API's
Route::group(['middleware'=>['auth:sanctum']], function(){
    Route::post('/changePassword',[AuthController::class, 'changePassword']);
    Route::post('/logout',[AuthController::class, 'logout']);
    Route::post('/registerUser',[AuthController::class, 'registerUser']);
    Route::put('/appUsers',[AuthController::class, 'update']);
    Route::get('/appUsers',[AuthController::class, 'allUsers']);
    Route::resource('product',ProductController::class);
    Route::resource('expenseType',ExpenseTypeController::class);
    Route::resource('expense',ExpenseController::class);
    Route::resource('order',OrderController::class);
    Route::get('/reportSales', [OrderController::class, 'Sales']);
    Route::get('/googleMapData', [OrderController::class, 'googleMapData']);
    Route::get('/totalDeliveries', [OrderController::class, 'totalDeliverie']);
    
    Route::post('/newStock', [ProductController::class, 'newStock'])->name('newStock');
    Route::get('/stock', [ProductController::class, 'stock'])->name('stock');
    Route::resource('category', CategoryController::class);
    Route::resource('subCategory', SubCategoryController::class);
    Route::resource('subSubCategory', SubSubCategoryController::class);
    Route::resource('customer', CustomerController::class);
    Route::get('/searchCustomer', [CustomerController::class, 'search']);
    Route::get('/customerHistory', [CustomerController::class, 'history']);
    Route::get('/customerBookings', [CustomerController::class, 'booking']);
    Route::get('/creditReport', [CustomerController::class, 'creditReport']);
    Route::resource('jarTracker', JarTrackerController::class);
    Route::post('/product/updateQty', [ProductController::class, 'updateQty']);
    Route::post('/fileUpload', [FileUpload::class, 'fileUpload']);
    Route::get('/monthlyReport', [OrderController::class, 'getMonthlyReport']);
    Route::get('/customerReport', [OrderController::class, 'customerReport'])->name('customerReport');
    Route::resource('company', CompanyInfoController::class);
    Route::put('/orders/{id}/updateReturnMoney', [OrderController::class, 'updateReturnMoney']);
    
    // Added routes for payment tracking
    Route::resource('paymentTracker', PaymentTrackerController::class);
    Route::get('/paymentTrackerReport', [PaymentTrackerController::class, 'generateReport']);
    Route::put('/paymentTracker/{id}', [PaymentTrackerController::class, 'update']);
    Route::put('/payment-tracker/{customerId}/update-amount', [PaymentTrackerController::class, 'updateAmount']);
    
 // Get all products with sizes
Route::get('products', [ProductController::class, 'index']);

// Create a new product with sizes
Route::post('products', [ProductController::class, 'store']);

// Get a single product with its sizes
Route::get('products/{id}', [ProductController::class, 'show']);

// Update an existing product and its sizes
Route::put('products/{id}', [ProductController::class, 'update']);

// Delete a product and its sizes
Route::delete('products/{id}', [ProductController::class, 'destroy']);

// Add or update stock for product sizes
Route::post('products/stock', [ProductController::class, 'newStock']);

// Get all product sizes for the company
Route::get('products/sizes', [ProductController::class, 'stock']);

// Delete a product size
Route::delete('product/size/{sizeId}', [ProductController::class, 'destroySize']);

// Update product size
Route::put('product/size/{id}', [ProductController::class, 'updateSize']);

Route::post('/order', [OrderController::class, 'store']);



});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
