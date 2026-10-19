<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notifikasi;
use Illuminate\Http\Request;

class NotifikasiController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $notifikasi = Notifikasi::where('user_id', $user->id)
            ->orderBy('id', 'desc')
            ->take(50)
            ->get();

        $unreadCount = Notifikasi::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'notifikasi' => $notifikasi,
                'unread_count' => $unreadCount,
            ],
        ]);
    }

    public function markAsRead($id, Request $request)
    {
        $user = $request->user();
        $notif = Notifikasi::where('id', $id)->where('user_id', $user->id)->firstOrFail();
        $notif->is_read = true;
        $notif->save();

        return response()->json([
            'success' => true,
            'message' => 'Notifikasi ditandai telah dibaca.',
        ]);
    }

    public function markAllAsRead(Request $request)
    {
        $user = $request->user();
        Notifikasi::where('user_id', $user->id)->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Semua notifikasi ditandai telah dibaca.',
        ]);
    }
}
