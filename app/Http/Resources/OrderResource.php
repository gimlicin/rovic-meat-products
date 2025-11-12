<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'user' => new UserResource($this->whenLoaded('user')),
            'status' => $this->status,
            'status_label' => $this->status_label,
            'total_price' => $this->total_price,
            'formatted_total' => '₱' . number_format($this->total_price, 2),
            'pickup_or_delivery' => $this->pickup_or_delivery,
            'notes' => $this->notes,
            'customer_name' => $this->customer_name,
            'customer_phone' => $this->customer_phone,
            'customer_email' => $this->customer_email,
            'delivery_address' => $this->delivery_address,
            'scheduled_date' => $this->scheduled_date?->format('Y-m-d H:i:s'),
            'is_bulk_order' => $this->is_bulk_order,
            'order_items' => OrderItemResource::collection($this->whenLoaded('orderItems')),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
