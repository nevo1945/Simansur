<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogAktivitas extends Model
{
    use HasFactory;

    protected $table = 'log_aktivitas';

    protected $fillable = [
        'user_id',
        'aksi',
        'modul',
        'record_id',
        'keterangan',
        'ip_address',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public static function catat(?int $userId, string $aksi, string $modul, ?int $recordId = null, ?string $keterangan = null, ?string $ip = null)
    {
        return self::create([
            'user_id' => $userId ?? auth()->id() ?? 1,
            'aksi' => $aksi,
            'modul' => $modul,
            'record_id' => $recordId,
            'keterangan' => $keterangan,
            'ip_address' => $ip ?? request()->ip(),
        ]);
    }
}
