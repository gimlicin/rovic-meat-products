import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import {
  ChevronRight,
  ChevronLeft,
  Heart,
  ShoppingCart,
  ArrowRight,
  Play,
  Star,
} from "lucide-react";

// Enhanced Button component with refined styling
import { ButtonHTMLAttributes } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "accent"
  | "cta"
  | "luxury";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  icon,
  ...props
}) => {
  const baseClasses =
    "font-medium transition-all duration-300 rounded-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-black text-white hover:bg-gray-800 focus:ring-black shadow-md",
    secondary:
      "bg-white text-black border border-gray-200 hover:bg-gray-50 focus:ring-gray-400 shadow-sm",
    outline:
      "bg-transparent border border-current hover:bg-gray-50 focus:ring-gray-400",
    accent:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md",
    cta: "bg-yellow-400 text-black hover:bg-yellow-500 focus:ring-yellow-400 shadow-md",
    luxury:
      "bg-gradient-to-r from-amber-700 to-yellow-500 text-white hover:from-amber-800 hover:to-yellow-600 focus:ring-amber-500 shadow-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {icon && <span className="ml-2">{icon}</span>}
    </button>
  );
};

export default function ShopBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Optional: Add scroll event listener for additional animations
    const handleScroll = () => {
      // Add any scroll-based animations here
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeInClass = isVisible
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-10";

  return (
    <div className={`bg-gradient-to-r from-red-600 to-red-700 text-white py-16 transition-all duration-1000 ${fadeInClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-block mb-4 px-4 py-2 bg-red-800/30 rounded-full text-sm font-medium">
              <Star className="w-4 h-4 inline mr-2" />
              Premium Quality
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Fresh Quality
              <span className="block">Meat Products</span>
            </h1>
            <p className="text-red-100 mb-8 text-lg leading-relaxed">
              Premium cuts delivered fresh to your door. Experience the finest selection 
              of meat products with guaranteed quality and freshness.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/products"
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center"
              >
                Shop Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <button 
                onClick={() => {
                  // Smooth scroll to featured products section
                  const productsSection = document.querySelector('[data-section="featured-products"]');
                  if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    // Fallback: scroll down by viewport height
                    window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
                  }
                }}
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <ShoppingCart className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fresh Delivery</h3>
                <p className="text-red-100">Same day delivery available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
