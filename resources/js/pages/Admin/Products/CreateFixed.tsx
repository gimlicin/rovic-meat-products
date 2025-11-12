import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Package, FolderOpen, ArrowLeft, Save } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

interface Props {
  categories: Category[];
}

export default function CreateProduct({ categories }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    image_url: '',
    is_active: true,
    is_best_selling: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/products');
  };

  return (
    <>
      <Head title="Create Product - Admin" />
      
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
          <div className="flex items-center px-6 py-4 border-b">
            <h1 className="text-xl font-bold text-gray-900">Rovic Meat Products</h1>
          </div>
          
          <nav className="mt-6">
            <div className="px-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</p>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                href="/admin/dashboard"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md mx-3"
              >
                <Package className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
              <Link
                href="/admin/products"
                className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md mx-3"
              >
                <Package className="w-5 h-5 mr-3" />
                Products
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md mx-3"
              >
                <FolderOpen className="w-5 h-5 mr-3" />
                Categories
              </Link>
            </div>
          </nav>

          <div className="absolute bottom-0 w-full p-4 border-t">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">admin@rovicmeat.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64">
          <div className="px-6 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/products"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Products
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create Product</h1>
                  <p className="text-gray-600">Add a new product to your inventory</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="max-w-2xl">
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product description"
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                      Price (PHP) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      step="0.01"
                      value={data.price}
                      onChange={(e) => setData('price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                  </div>

                  <div>
                    <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      id="stock_quantity"
                      value={data.stock_quantity}
                      onChange={(e) => setData('stock_quantity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                    {errors.stock_quantity && <p className="mt-1 text-sm text-red-600">{errors.stock_quantity}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category_id"
                    value={data.category_id}
                    onChange={(e) => setData('category_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
                </div>

                <div>
                  <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="image_url"
                    value={data.image_url}
                    onChange={(e) => setData('image_url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.image_url && <p className="mt-1 text-sm text-red-600">{errors.image_url}</p>}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={data.is_active}
                      onChange={(e) => setData('is_active', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                      Active (product will be visible to customers)
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_best_selling"
                      checked={data.is_best_selling}
                      onChange={(e) => setData('is_best_selling', e.target.checked)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_best_selling" className="ml-2 block text-sm text-gray-700">
                      <span className="flex items-center">
                        Best Selling (will appear in home page featured section)
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <Link
                    href="/admin/products"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {processing ? 'Creating...' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
