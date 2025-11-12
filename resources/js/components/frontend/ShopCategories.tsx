
import React from "react";
import { Package, Beef, Utensils } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  products_count?: number;
}

interface ShopCategoriesProps {
  categories?: Category[];
  onCategorySelect?: (categoryId: number | null) => void;
  selectedCategoryId?: number | null;
}

function ShopCategories({ 
  categories = [], 
  onCategorySelect,
  selectedCategoryId 
}: ShopCategoriesProps) {
  
  // Default categories with icons
  const defaultCategories = [
    {
      id: 1,
      name: "Frozen Meat",
      slug: "frozen-meat",
      icon: Package,
      color: "text-blue-600",
    },
    {
      id: 2,
      name: "Processed Meat",
      slug: "processed-meat",
      icon: Beef,
      color: "text-green-700",
    },
    {
      id: 3,
      name: "Marinated Products",
      slug: "marinated-products",
      icon: Utensils,
      color: "text-emerald-600",
    },
  ];

  // Use passed categories or default ones
  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  const handleCategoryClick = (categoryId: number) => {
    if (onCategorySelect) {
      // If this category is already selected, deselect it (show all)
      const newSelection = selectedCategoryId === categoryId ? null : categoryId;
      onCategorySelect(newSelection);
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('frozen')) return Package;
    if (name.includes('processed') || name.includes('meat')) return Beef;
    if (name.includes('marinated')) return Utensils;
    return Package; // default
  };

  const getCategoryColor = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('frozen')) return "text-blue-600";
    if (name.includes('processed')) return "text-green-700";
    if (name.includes('marinated')) return "text-emerald-600";
    return "text-gray-600"; // default
  };

  return (
    <div className="w-full py-8 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section title */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Shop by Category</h2>
          <p className="text-gray-600 mt-2">
            Browse our premium selection by category
          </p>
        </div>

        {/* Category buttons */}
        <div className="flex justify-center">
          <div className="flex flex-wrap gap-4 justify-center">
            {displayCategories.map((category) => {
              const isSelected = selectedCategoryId === category.id;
              const color = 'color' in category ? category.color : getCategoryColor(category.name);
              const name = category.name.toLowerCase();
              
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`flex flex-col items-center p-6 rounded-lg border-2 transition-all duration-300 hover:shadow-lg ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`mb-3 ${isSelected ? 'text-blue-600' : color}`}>
                    {name.includes('frozen') && <Package size={32} />}
                    {(name.includes('processed') || name.includes('meat')) && !name.includes('frozen') && <Beef size={32} />}
                    {name.includes('marinated') && <Utensils size={32} />}
                    {!name.includes('frozen') && !name.includes('processed') && !name.includes('meat') && !name.includes('marinated') && <Package size={32} />}
                  </div>
                  <span className="font-medium text-sm text-center">
                    {category.name}
                  </span>
                  {'products_count' in category && category.products_count !== undefined && (
                    <span className="text-xs text-gray-500 mt-1">
                      {category.products_count} products
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset Category Filter button - Only show when a category is selected */}
        {selectedCategoryId !== null && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => onCategorySelect && onCategorySelect(null)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors border border-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Clear Category Filter</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopCategories;
