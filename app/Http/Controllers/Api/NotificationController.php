<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Get notifications for the current user
     */
    public function index(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'notifications' => [],
                'unread_count' => 0
            ]);
        }

        $notifications = Notification::forUser(Auth::id())
            ->with(['order'])
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => (string) $notification->id,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'type' => $notification->type,
                    'read' => $notification->read,
                    'created_at' => $notification->created_at->toISOString(),
                    'order_id' => $notification->order_id,
                ];
            });

        $unreadCount = Notification::forUser(Auth::id())->unread()->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount
        ]);
    }

    /**
     * Mark a notification as read
     */
    public function markAsRead(Request $request, $id)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $notification = Notification::forUser(Auth::id())->find($id);
        
        if (!$notification) {
            return response()->json(['error' => 'Notification not found'], 404);
        }

        $notification->markAsRead();

        return response()->json(['message' => 'Notification marked as read']);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        Notification::forUser(Auth::id())->unread()->update([
            'read' => true,
            'read_at' => now(),
        ]);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    /**
     * Delete a notification
     */
    public function destroy(Request $request, $id)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $notification = Notification::forUser(Auth::id())->find($id);
        
        if (!$notification) {
            return response()->json(['error' => 'Notification not found'], 404);
        }

        $notification->delete();

        return response()->json(['message' => 'Notification deleted']);
    }
}
