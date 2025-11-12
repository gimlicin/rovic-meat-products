import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function CartButton() {
  const { totalItems, toggleCart } = useCart();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 text-gray-700 hover:text-red-600 transition-colors"
      aria-label="Shopping cart"
    >
      <ShoppingCart className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
}
