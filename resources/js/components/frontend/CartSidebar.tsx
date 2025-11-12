import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Link, router } from '@inertiajs/react';
const route = (window as any).route || ((name: string) => name);
import axios from 'axios';

export default function CartSidebar() {
  const { items, totalItems, totalPrice, isOpen, closeCart, updateQuantity, removeItem } = useCart();
  const [updatingItems, setUpdatingItems] = React.useState<Set<number>>(new Set());

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(price);
  };

  const increaseQuantity = (id: number, currentQuantity: number, item: any) => {
    // Prevent multiple rapid clicks
    if (updatingItems.has(id)) return;
    
    // Check if we can increase quantity based on stock
    // Handle cases where stock info might not be loaded yet
    if (!item.track_stock || item.available_stock === undefined) {
      // If stock tracking is disabled or data not loaded, allow increase
      setUpdatingItems(prev => new Set(prev).add(id));
      updateQuantity(id, currentQuantity + 1);
      // Clear updating state after a delay
      setTimeout(() => {
        setUpdatingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 500);
      return;
    }
    
    const maxQuantity = Math.min(
      item.available_stock || 0, 
      item.max_order_quantity || 999
    );
    
    if (currentQuantity < maxQuantity) {
      setUpdatingItems(prev => new Set(prev).add(id));
      updateQuantity(id, currentQuantity + 1);
      // Clear updating state after a delay
      setTimeout(() => {
        setUpdatingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 500);
    }
  };

  const decreaseQuantity = (id: number, currentQuantity: number) => {
    // Prevent multiple rapid clicks
    if (updatingItems.has(id)) return;
    
    if (currentQuantity > 1) {
      setUpdatingItems(prev => new Set(prev).add(id));
      updateQuantity(id, currentQuantity - 1);
      // Clear updating state after a delay
      setTimeout(() => {
        setUpdatingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 500);
    }
  };

  const handleCheckout = () => {
    // Convert cart items to the format expected by the backend
    const cartItems = items.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      notes: item.notes || null
    }));

    // Get CSRF token from multiple sources (most reliable method)
    const csrfToken = axios.defaults.headers.common['X-CSRF-TOKEN'] || 
                     (window as any).Laravel?.csrfToken ||
                     document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    // Navigate to checkout with cart items
    router.post(
      route('checkout.post'),
      { cart_items: cartItems },
      { 
        headers: { 
          'X-CSRF-TOKEN': csrfToken as string
        },
        preserveScroll: true,
      }
    );
    closeCart();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 border-l border-gray-200">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Shopping Cart ({totalItems})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Add some delicious meat products to get started!</p>
                <button
                  onClick={closeCart}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image_url || '/api/placeholder/60/60'}
                        alt={item.name}
                        className="w-15 h-15 object-cover rounded-md"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {item.category.name} • {item.weight}{item.unit}
                      </p>
                      <p className="text-sm font-semibold text-green-600">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          onClick={() => decreaseQuantity(item.id, item.quantity)}
                          className="p-1 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 py-1 text-sm font-medium min-w-[30px] text-center">
                          {updatingItems.has(item.id) ? '...' : item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.id, item.quantity, item)}
                          className="p-1 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={
                            updatingItems.has(item.id) ||
                            (item.track_stock && 
                            item.available_stock !== undefined &&
                            item.quantity >= Math.min(item.available_stock || 0, item.max_order_quantity || 999))
                          }
                          title={
                            item.track_stock && item.available_stock !== undefined && item.quantity >= (item.available_stock || 0)
                              ? `Only ${item.available_stock} available in stock`
                              : undefined
                          }
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      {/* Stock warning */}
                      {item.track_stock && item.available_stock !== undefined && item.quantity >= item.available_stock && (
                        <span className="text-xs text-orange-600 font-medium">
                          Max stock reached
                        </span>
                      )}
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-green-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors text-center"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={closeCart}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Additional Info */}
              <div className="text-xs text-gray-500 text-center">
                <p>Free delivery on orders over ₱1,000</p>
                <p>Secure checkout • Safe payment</p>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}
