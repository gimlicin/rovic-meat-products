import React from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  formatted_price: string;
  description: string;
  image_url: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  is_best_seller: boolean;
  stock_quantity: number;
  weight: number;
  unit: string;
  is_active: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  products_count?: number;
}

interface HomeProps {
  featuredProducts: Product[];
  categories: Category[];
}

export default function HomeSimple({ featuredProducts, categories }: HomeProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">Rovic Meat Products</h1>
            <nav className="space-x-8">
              <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="/products" className="text-gray-600 hover:text-gray-900">Products</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Fresh Quality Meat Products</h2>
          <p className="text-xl mb-8">Premium cuts delivered fresh to your door</p>
          <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Shop Now
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category) => (
                <div key={category.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h4>
                  <p className="text-gray-600">Explore our {category.name.toLowerCase()} selection</p>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500">
                <p>No categories available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Featured Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(featuredProducts) && featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div key={product.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
                    <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-red-600">{product.formatted_price}</span>
                      {product.is_best_seller && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Best Seller</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center text-gray-500">
                <p>No featured products available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Rovic Meat Products. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
