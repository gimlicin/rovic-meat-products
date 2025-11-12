<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class CartController extends Controller
{
    /**
     * Get cart items for the current user/session
     */
    public function index(Request $request)
    {
        $cartItems = $this->getCartItems($request);
        
        $items = $cartItems->with(['product.category'])->get()->map(function ($cartItem) {
            $product = $cartItem->product;
            
            // Auto-adjust quantity if it exceeds available stock
            if ($product && $product->track_stock && method_exists($product, 'getMaxOrderableQuantity')) {
                try {
                    $maxAllowed = $product->getMaxOrderableQuantity();
                    if ($maxAllowed > 0 && $cartItem->quantity > $maxAllowed) {
                        $cartItem->update(['quantity' => $maxAllowed]);
                    }
                } catch (\Exception $e) {
                    // Log error but don't break the cart
                    \Log::warning('Failed to auto-adjust cart quantity', [
                        'cart_item_id' => $cartItem->id,
                        'error' => $e->getMessage()
                    ]);
                }
            }
            
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'formatted_price' => '₱' . number_format($product->price, 2),
                'image_url' => $product->image_url,
                'category' => [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                    'slug' => $product->category->slug ?? '',
                ],
                'weight' => $product->weight,
                'unit' => $product->unit,
                'quantity' => $cartItem->quantity,
                'notes' => $cartItem->notes,
                'total_price' => $cartItem->getTotalPrice(),
                'stock_quantity' => $product->stock_quantity,
                'available_stock' => $product->getAvailableStock(),
                'max_order_quantity' => $product->max_order_quantity,
                'track_stock' => $product->track_stock,
            ];
        });

        $totalItems = $items->sum('quantity');
        $totalPrice = $items->sum('total_price');

        return response()->json([
            'items' => $items,
            'totalItems' => $totalItems,
            'totalPrice' => $totalPrice,
        ]);
    }

    /**
     * Add item to cart
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:500',
        ]);

        $product = Product::findOrFail($request->product_id);
        
        // Check stock availability
        if ($product->track_stock && !$product->canFulfillQuantity($request->quantity)) {
            return response()->json([
                'error' => 'Insufficient stock available',
                'available_stock' => $product->getAvailableStock()
            ], 400);
        }

        $cartItem = $this->findOrCreateCartItem($request, $request->product_id);
        
        if ($cartItem->exists) {
            // Update existing cart item
            $newQuantity = $cartItem->quantity + $request->quantity;
            
            // Check if new quantity exceeds stock
            if ($product->track_stock && !$product->canFulfillQuantity($newQuantity)) {
                return response()->json([
                    'error' => 'Adding this quantity would exceed available stock',
                    'available_stock' => $product->getAvailableStock(),
                    'current_in_cart' => $cartItem->quantity
                ], 400);
            }
            
            $cartItem->update([
                'quantity' => $newQuantity,
                'notes' => $request->notes ?? $cartItem->notes,
            ]);
        } else {
            // Create new cart item
            $cartItem->fill([
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'notes' => $request->notes,
            ]);
            
            if (Auth::check()) {
                $cartItem->user_id = Auth::id();
            } else {
                $cartItem->session_id = $this->getSessionId($request);
            }
            
            $cartItem->save();
        }

        return response()->json([
            'message' => 'Item added to cart successfully',
            'cart_item' => $cartItem->load('product')
        ]);
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, $productId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:500',
        ]);

        $cartItem = $this->findCartItem($request, $productId);
        
        if (!$cartItem) {
            return response()->json(['error' => 'Cart item not found'], 404);
        }

        $product = $cartItem->product;
        
        // Check stock availability
        if ($product->track_stock && !$product->canFulfillQuantity($request->quantity)) {
            return response()->json([
                'error' => 'Insufficient stock available',
                'available_stock' => $product->getAvailableStock()
            ], 400);
        }

        $cartItem->update([
            'quantity' => $request->quantity,
            'notes' => $request->notes ?? $cartItem->notes,
        ]);

        return response()->json([
            'message' => 'Cart item updated successfully',
            'cart_item' => $cartItem->load('product')
        ]);
    }

    /**
     * Remove item from cart
     */
    public function destroy(Request $request, $productId)
    {
        $cartItem = $this->findCartItem($request, $productId);
        
        if (!$cartItem) {
            return response()->json(['error' => 'Cart item not found'], 404);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Item removed from cart successfully']);
    }

    /**
     * Clear all cart items
     */
    public function clear(Request $request)
    {
        $this->getCartItems($request)->delete();

        return response()->json(['message' => 'Cart cleared successfully']);
    }

    /**
     * Sync guest cart with user cart on login
     */
    public function syncGuestCart(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $sessionId = $request->input('session_id');
        if (!$sessionId) {
            return response()->json(['error' => 'Session ID required'], 400);
        }

        // Get guest cart items
        $guestCartItems = CartItem::where('session_id', $sessionId)->get();
        
        foreach ($guestCartItems as $guestItem) {
            // Check if user already has this product in cart
            $userCartItem = CartItem::where('user_id', Auth::id())
                ->where('product_id', $guestItem->product_id)
                ->first();
                
            if ($userCartItem) {
                // Merge quantities
                $userCartItem->update([
                    'quantity' => $userCartItem->quantity + $guestItem->quantity,
                    'notes' => $guestItem->notes ?? $userCartItem->notes,
                ]);
            } else {
                // Transfer guest item to user
                $guestItem->update([
                    'user_id' => Auth::id(),
                    'session_id' => null,
                ]);
            }
        }

        // Clean up any remaining guest items
        CartItem::where('session_id', $sessionId)->delete();

        return response()->json(['message' => 'Guest cart synced successfully']);
    }

    /**
     * Get cart items query for current user/session
     */
    private function getCartItems(Request $request)
    {
        if (Auth::check()) {
            return CartItem::forUser(Auth::id());
        } else {
            $sessionId = $this->getSessionId($request);
            return CartItem::forSession($sessionId);
        }
    }

    /**
     * Find existing cart item or create new instance
     */
    private function findOrCreateCartItem(Request $request, $productId)
    {
        if (Auth::check()) {
            return CartItem::firstOrNew([
                'user_id' => Auth::id(),
                'product_id' => $productId,
            ]);
        } else {
            return CartItem::firstOrNew([
                'session_id' => $this->getSessionId($request),
                'product_id' => $productId,
            ]);
        }
    }

    /**
     * Find existing cart item
     */
    private function findCartItem(Request $request, $productId)
    {
        if (Auth::check()) {
            return CartItem::where('user_id', Auth::id())
                ->where('product_id', $productId)
                ->first();
        } else {
            return CartItem::where('session_id', $this->getSessionId($request))
                ->where('product_id', $productId)
                ->first();
        }
    }

    /**
     * Get or generate session ID for guest users
     */
    private function getSessionId(Request $request)
    {
        $sessionId = $request->session()->getId();
        
        if (!$sessionId) {
            $sessionId = Str::random(40);
            $request->session()->setId($sessionId);
        }
        
        return $sessionId;
    }
}
