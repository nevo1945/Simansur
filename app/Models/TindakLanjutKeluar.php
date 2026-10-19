<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TindakLanjutKeluar extends Model
{
    use HasFactory;

    protected $table = 'tindak_lanjut_keluar';
    public $timestamps = false;

    protected $fillable = [
        'surat_keluar_id',
        'user_id',
        'jenis',
        'catatan',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function suratKeluar()
    {
        return $this->belongsTo(SuratKeluar::class, 'surat_keluar_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
