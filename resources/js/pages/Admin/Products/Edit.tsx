import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Package, FolderOpen, ArrowLeft, Save, Upload, X } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: number;
  image_url: string;
  is_active: boolean;
  is_best_selling: boolean;
  is_promo: boolean;
}

interface Props {
  product: Product;
  categories: Category[];
}

export default function EditProduct({ product, categories }: Props) {
  const [imagePreview, setImagePreview] = useState<string>(product.image_url || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    stock_quantity: product.stock_quantity.toString(),
    category_id: product.category_id.toString(),
    image: null as File | null,
    image_url: product.image_url || '',
    is_active: product.is_active,
    is_best_selling: product.is_best_selling,
    is_promo: product.is_promo || false,
    weight: (product as any).weight?.toString() || '1',
    unit: (product as any).unit || 'kg',
    max_order_quantity: (product as any).max_order_quantity || 100,
    low_stock_threshold: (product as any).low_stock_threshold || 10,
    track_stock: (product as any).track_stock ?? true,
    _method: 'PATCH',
  });

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Store file for upload
      setSelectedFile(file);
      setData('image', file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const clearImage = () => {
    setImagePreview('');
    setSelectedFile(null);
    setData('image', null);
    setData('image_url', '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Use post with _method for file uploads (Laravel doesn't support PATCH with files)
    post(`/admin/products/${product.id}`, {
      forceFormData: true,
      preserveScroll: true,
    });
  };

  return (
    <>
      <Head title={`Edit ${product.name} - Admin`} />
      
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
                  <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                  <p className="text-gray-600">Update product information</p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                      Weight/Quantity *
                    </label>
                    <input
                      type="number"
                      id="weight"
                      step="0.01"
                      value={data.weight}
                      onChange={(e) => setData('weight', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1.0"
                    />
                    {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
                  </div>

                  <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
                      Unit *
                    </label>
                    <select
                      id="unit"
                      value={data.unit}
                      onChange={(e) => setData('unit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="kg">Kilogram (kg)</option>
                      <option value="g">Gram (g)</option>
                      <option value="lbs">Pounds (lbs)</option>
                      <option value="oz">Ounce (oz)</option>
                      <option value="pieces">Pieces</option>
                      <option value="packs">Packs</option>
                    </select>
                    {errors.unit && <p className="mt-1 text-sm text-red-600">{errors.unit}</p>}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image
                  </label>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mb-4 relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Drag & Drop Zone */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragActive
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Drag and drop an image here, or{' '}
                      <button
                        type="button"
                        onClick={() => document.getElementById('file-input-edit')?.click()}
                        className="text-blue-600 hover:text-blue-500 font-medium"
                      >
                        browse files
                      </button>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    id="file-input-edit"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                  />

                  {/* Manual URL Input (Optional) */}
                  <div className="mt-4">
                    <label htmlFor="image_url" className="block text-xs text-gray-500 mb-1">
                      Or enter image URL manually:
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="url"
                        id="image_url"
                        value={data.image_url}
                        onChange={(e) => {
                          setData('image_url', e.target.value);
                          if (e.target.value) {
                            setImagePreview(e.target.value);
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="https://example.com/image.jpg"
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('file-input-edit')?.click()}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
                      >
                        <FolderOpen className="w-4 h-4 mr-2" />
                        Browse
                      </button>
                    </div>
                  </div>

                  {errors.image_url && <p className="mt-1 text-sm text-red-600">{errors.image_url}</p>}
                  {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
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

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_promo"
                      checked={data.is_promo}
                      onChange={(e) => setData('is_promo', e.target.checked)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_promo" className="ml-2 block text-sm text-gray-700">
                      <span className="flex items-center">
                        Promo (will appear in promotional sections)
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Promo
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
                    {processing ? 'Updating...' : 'Update Product'}
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
