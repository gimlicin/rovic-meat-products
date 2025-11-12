<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of products
     */
    public function index(Request $request)
    {
        $query = Product::with('category')->active();

        // Filter by category
        if ($request->has('category') && $request->category) {
            $query->byCategory($request->category);
        }

        // Search by name or description
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Filter best sellers
        if ($request->has('best_sellers') && $request->best_sellers) {
            $query->bestSellers();
        }

        $products = $query->orderBy('name')->paginate(12);
        $categories = Category::withProducts()->get();

        return Inertia::render('dashboard/products/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['category', 'search', 'best_sellers'])
        ]);
    }

    /**
     * Show the form for creating a new product
     */
    public function create()
    {
        $this->authorize('create', Product::class);
        
        $categories = Category::orderBy('name')->get();
        
        return Inertia::render('dashboard/products/create', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created product
     */
    public function store(StoreProductRequest $request)
    {
        $this->authorize('create', Product::class);
        
        $product = Product::create($request->validated());

        return redirect()->route('products.index')
            ->with('success', 'Product created successfully!');
    }

    /**
     * Display the specified product
     */
    public function show(Product $product)
    {
        $product->load('category');
        
        // Add available stock information
        $product->available_stock = $product->getAvailableStock();
        $product->max_orderable = $product->getMaxOrderableQuantity();
        
        // Get related products from the same category
        $relatedProducts = Product::active()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with('category')
            ->take(4)
            ->get();
        
        // If not enough related products in same category, get from other categories
        if ($relatedProducts->count() < 4) {
            $additionalProducts = Product::active()
                ->where('id', '!=', $product->id)
                ->whereNotIn('id', $relatedProducts->pluck('id'))
                ->with('category')
                ->take(4 - $relatedProducts->count())
                ->get();
            
            $relatedProducts = $relatedProducts->concat($additionalProducts);
        }
        
        return Inertia::render('ProductDetail', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * Show the form for editing the specified product
     */
    public function edit(Product $product)
    {
        $this->authorize('update', $product);
        
        $categories = Category::orderBy('name')->get();
        
        return Inertia::render('dashboard/products/edit', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    /**
     * Update the specified product
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $this->authorize('update', $product);
        
        $product->update($request->validated());

        return redirect()->route('products.index')
            ->with('success', 'Product updated successfully!');
    }

    /**
     * Remove the specified product
     */
    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);
        
        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Product deleted successfully!');
    }

    /**
     * Display product catalog page for customers
     */
    public function catalog(Request $request)
    {
        $query = Product::with('category')->active();

        // Filter by category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Search by name, description
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', '%' . $searchTerm . '%')
                  ->orWhere('description', 'like', '%' . $searchTerm . '%');
            });
        }

        // Filter by price range
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Filter by stock status
        if ($request->filled('in_stock')) {
            if ($request->boolean('in_stock')) {
                $query->where(function ($q) {
                    $q->where('track_stock', false)
                      ->orWhereRaw('(stock_quantity - reserved_stock) > 0');
                });
            }
        }

        // Filter by best sellers
        if ($request->boolean('best_sellers')) {
            $query->bestSellers();
        }

        // Sorting
        $sortBy = $request->get('sort', 'featured');
        switch ($sortBy) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('name', 'desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'featured':
            default:
                $query->orderBy('is_best_selling', 'desc')
                      ->orderBy('name', 'asc');
                break;
        }

        $products = $query->paginate(9)->withQueryString();

        $categories = Category::active()->get();

        // Get price range for filter
        $priceRange = Product::active()
            ->selectRaw('MIN(price) as min_price, MAX(price) as max_price')
            ->first();

        // Debug: Log what we're sending
        \Log::info('Products catalog data', [
            'products_count' => $products->count(),
            'has_data' => !empty($products->items()),
            'categories_count' => $categories->count(),
            'pagination_meta' => [
                'current_page' => $products->currentPage(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
                'total' => $products->total(),
                'per_page' => $products->perPage(),
                'last_page' => $products->lastPage(),
            ],
        ]);

        $filters = $request->only(['category_id', 'search', 'best_sellers', 'min_price', 'max_price', 'in_stock', 'sort']);
        
        return Inertia::render('products', [
            'products' => [
                'data' => $products->items(),
                'links' => $products->linkCollection()->toArray(),
                'meta' => [
                    'current_page' => $products->currentPage(),
                    'from' => $products->firstItem(),
                    'to' => $products->lastItem(),
                    'total' => $products->total(),
                    'per_page' => $products->perPage(),
                    'last_page' => $products->lastPage(),
                ],
            ],
            'categories' => $categories,
            'filters' => (object)$filters, // Ensure it's always an object, not an array
            'priceRange' => [
                'min' => $priceRange->min_price ?? 0,
                'max' => $priceRange->max_price ?? 1000,
            ],
        ]);
    }

    /**
     * Toggle best seller status
     */
    public function toggleBestSeller(Product $product)
    {
        $this->authorize('toggleBestSeller', $product);
        
        $product->update([
            'is_best_seller' => !$product->is_best_seller
        ]);

        return redirect()->back()
            ->with('success', 'Best seller status updated!');
    }

    /**
     * Display home page with featured products
     */
    public function home()
    {
        $featuredProducts = Product::active()
            ->bestSelling()
            ->with('category')
            ->take(12)
            ->get();

        // If we don't have enough best selling products, fill with regular featured products
        if ($featuredProducts->count() < 12) {
            $additionalProducts = Product::active()
                ->with('category')
                ->whereNotIn('id', $featuredProducts->pluck('id'))
                ->orderBy('created_at', 'desc') // Show newest products first
                ->take(12 - $featuredProducts->count())
                ->get();
            
            $featuredProducts = $featuredProducts->concat($additionalProducts);
        }

        $categories = Category::active()
            ->withCount('products')
            ->get();

        return Inertia::render('home', [
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
        ]);
    }

    /**
     * API endpoint for products (returns JSON)
     */
    public function apiIndex(Request $request)
    {
        $query = Product::with('category')->active();

        // Filter by category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by search term
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Filter by best sellers
        if ($request->boolean('best_sellers')) {
            $query->bestSellers();
        }

        $products = $query->orderBy('is_best_seller', 'desc')
                         ->orderBy('name')
                         ->paginate(12);

        return ProductResource::collection($products);
    }
}
