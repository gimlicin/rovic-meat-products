<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories
     */
    public function index()
    {
        $categories = Category::withCount('products')
            ->orderBy('name')
            ->get();

        return Inertia::render('dashboard/categories/index', [
            'categories' => $categories
        ]);
    }

    /**
     * Show the form for creating a new category
     */
    public function create()
    {
        $this->authorize('create', Category::class);
        
        return Inertia::render('dashboard/categories/create');
    }

    /**
     * Store a newly created category
     */
    public function store(StoreCategoryRequest $request)
    {
        $this->authorize('create', Category::class);
        
        $validated = $request->validated();

        // Generate slug from name
        $validated['slug'] = Str::slug($validated['name']);

        // Ensure slug is unique
        $originalSlug = $validated['slug'];
        $counter = 1;
        while (Category::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $originalSlug . '-' . $counter;
            $counter++;
        }

        Category::create($validated);

        return redirect()->route('categories.index')
            ->with('success', 'Category created successfully!');
    }

    /**
     * Display the specified category
     */
    public function show(Category $category)
    {
        $category->load(['products' => function ($query) {
            $query->active()->orderBy('name');
        }]);

        return Inertia::render('dashboard/categories/show', [
            'category' => $category
        ]);
    }

    /**
     * Show the form for editing the specified category
     */
    public function edit(Category $category)
    {
        $this->authorize('update', $category);
        
        return Inertia::render('dashboard/categories/edit', [
            'category' => $category
        ]);
    }

    /**
     * Update the specified category
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $this->authorize('update', $category);
        
        $validated = $request->validated();

        // Update slug if name changed
        if ($validated['name'] !== $category->name) {
            $validated['slug'] = Str::slug($validated['name']);
            
            // Ensure slug is unique
            $originalSlug = $validated['slug'];
            $counter = 1;
            while (Category::where('slug', $validated['slug'])->where('id', '!=', $category->id)->exists()) {
                $validated['slug'] = $originalSlug . '-' . $counter;
                $counter++;
            }
        }

        $category->update($validated);

        return redirect()->route('categories.index')
            ->with('success', 'Category updated successfully!');
    }

    /**
     * Remove the specified category
     */
    public function destroy(Category $category)
    {
        $this->authorize('delete', $category);
        
        // Check if category has products
        if ($category->products()->count() > 0) {
            return redirect()->route('categories.index')
                ->with('error', 'Cannot delete category that has products. Please move or delete the products first.');
        }

        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Category deleted successfully!');
    }

    /**
     * API endpoint for categories index
     */
    public function apiIndex()
    {
        $categories = Category::withProducts()
            ->withCount('products')
            ->orderBy('name')
            ->get();

        return CategoryResource::collection($categories);
    }

    /**
     * API endpoint for categories with products
     */
    public function api(Request $request)
    {
        $query = Category::withCount('products');

        if ($request->boolean('with_products')) {
            $query->with('products');
        }

        $categories = $query->get();

        return CategoryResource::collection($categories);
    }
}
