<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'formatted_price' => '₱' . number_format($this->price, 2),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'category_id' => $this->category_id,
            'is_best_seller' => $this->is_best_seller,
            'image_url' => $this->image_url,
            'stock_quantity' => $this->stock_quantity,
            'weight' => $this->weight,
            'unit' => $this->unit,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
