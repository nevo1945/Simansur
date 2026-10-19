<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('surat_masuk', function (Blueprint $table) {
            $table->id();
            $table->string('no_agenda')->unique();
            $table->string('no_surat');
            $table->date('tanggal_surat');
            $table->date('tanggal_terima');
            $table->string('opd_asal');
            $table->text('perihal');
            $table->enum('sifat', ['biasa', 'penting', 'segera', 'rahasia'])->default('biasa');
            $table->string('bidang_tujuan', 50);
            $table->text('isi_disposisi')->nullable();
            $table->string('file_scan');
            $table->enum('status', [
                'baru',
                'diteruskan_kasubid',
                'diteruskan_staff',
                'selesai_staff',
                'terverifikasi_kasubid',
                'disetujui_kabid',
                'diarsipkan',
                'perlu_koreksi'
            ])->default('baru');
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surat_masuk');
    }
};
