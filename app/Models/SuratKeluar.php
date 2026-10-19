<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SuratKeluar extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'surat_keluar';

    protected $fillable = [
        'no_agenda',
        'no_surat',
        'tanggal_surat',
        'opd_tujuan',
        'perihal',
        'sifat',
        'jenis_dokumen',
        'file_scan',
        'status',
        'created_by',
        'verified_by',
        'approved_by',
        'approved_at',
        'keterangan',
    ];

    protected $casts = [
        'tanggal_surat' => 'date',
        'approved_at' => 'datetime',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function tindakLanjutKeluar()
    {
        return $this->hasMany(TindakLanjutKeluar::class, 'surat_keluar_id')->with('user')->orderBy('created_at', 'asc');
    }

    public static function generateNoAgenda(): string
    {
        $year = date('Y');
        $month = date('m');
        $count = self::whereYear('created_at', $year)->count() + 1;
        return sprintf("SK/%s/%s/%04d", $year, $month, $count);
    }
}
