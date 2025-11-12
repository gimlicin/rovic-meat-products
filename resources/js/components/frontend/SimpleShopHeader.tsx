import { useState } from "react";
import { ShoppingBag, User, Search, Bell } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { useCart } from "@/contexts/CartContext";
import { useNotifications } from "@/contexts/NotificationContext";
import SimpleSearchBar from "./SimpleSearchBar";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface PageProps {
  auth: {
    user: User | null;
  };
  [key: string]: any;
}

export default function SimpleShopHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { auth } = usePage<PageProps>().props || {};
  const { totalItems, toggleCart } = useCart();
  const { unreadCount, toggleNotifications } = useNotifications();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-orange-600">
              Rovic<span className="text-gray-900">Shop</span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-xl mx-8">
            <SimpleSearchBar />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            {auth?.user && (
              <button
                onClick={toggleNotifications}
                className="rounded-full relative p-2 hover:bg-gray-100 transition-colors"
              >
                <Bell className="h-5 w-5 text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-medium text-white">
                    {unreadCount}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </button>
            )}

            {/* Shopping Cart */}
            <button
              onClick={toggleCart}
              className="rounded-full relative p-2 hover:bg-gray-100 transition-colors"
            >
              <ShoppingBag className="h-5 w-5 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs font-medium text-white">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">Shopping Cart</span>
            </button>

            {/* User Account */}
            {auth?.user ? (
              <Link
                href="/dashboard"
                className="rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <User className="h-5 w-5 text-gray-700" />
                <span className="sr-only">Account</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-3">
          <SimpleSearchBar />
        </div>
      </div>
    </header>
  );
}
