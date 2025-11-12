import ProductListing from '@/components/frontend/ProductListing'
import ShopBanner from '@/components/frontend/ShopBanner'
import ShopCategories from '@/components/frontend/ShopCategories'
import ShopFrontLayout from '@/layouts/shop-front-layout'
import React, { useState } from 'react'

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

export default function home({ featuredProducts = [], categories = [] }: HomeProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <ShopFrontLayout>
        <div className="min-h-screen">
            <div className="">
                <ShopBanner/>
            </div>
            <div className="py-12">
                <ShopCategories
                  categories={categories}
                  onCategorySelect={handleCategorySelect}
                  selectedCategoryId={selectedCategoryId}
                />
            </div>
            <div className="py-6">
                <ProductListing 
                  initialProducts={Array.isArray(featuredProducts) ? featuredProducts : []}
                  initialCategories={Array.isArray(categories) ? categories : []}
                  selectedCategoryId={selectedCategoryId}
                />
            </div>
        </div>
    </ShopFrontLayout>
  )
}
