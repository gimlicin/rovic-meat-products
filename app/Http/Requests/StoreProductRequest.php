<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric|min:0|max:999999.99',
            'category_id' => 'required|exists:categories,id',
            'is_best_selling' => 'boolean',
            'is_promo' => 'boolean',
            'image_url' => 'nullable|url|max:255',
            'stock_quantity' => 'required|integer|min:0',
            'weight' => 'nullable|numeric|min:0|max:999.99',
            'unit' => 'required|string|in:kg,lbs,pieces,grams,ounces',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Product name is required.',
            'price.required' => 'Product price is required.',
            'price.numeric' => 'Price must be a valid number.',
            'price.min' => 'Price cannot be negative.',
            'category_id.required' => 'Please select a category.',
            'category_id.exists' => 'Selected category does not exist.',
            'stock_quantity.required' => 'Stock quantity is required.',
            'stock_quantity.integer' => 'Stock quantity must be a whole number.',
            'unit.in' => 'Unit must be one of: kg, lbs, pieces, grams, ounces.',
            'image_url.url' => 'Image URL must be a valid URL.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'category_id' => 'category',
            'is_best_selling' => 'best seller status',
            'is_promo' => 'promo status',
            'image_url' => 'image URL',
            'stock_quantity' => 'stock quantity',
            'is_active' => 'active status',
        ];
    }
}
