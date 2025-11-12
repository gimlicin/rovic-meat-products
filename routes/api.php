<?php

use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public API routes for frontend components
Route::get('/products', [ProductController::class, 'apiIndex']);
Route::get('/categories', [CategoryController::class, 'api']);

// Cart and Notification API routes moved to web.php for proper session management
