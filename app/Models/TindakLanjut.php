<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TindakLanjut extends Model
{
    use HasFactory;

    protected $table = 'tindak_lanjut';
    public $timestamps = false;

    protected $fillable = [
        'surat_masuk_id',
        'user_id',
        'jenis',
        'catatan',
        'file_bukti',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function suratMasuk()
    {
        return $this->belongsTo(SuratMasuk::class, 'surat_masuk_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
