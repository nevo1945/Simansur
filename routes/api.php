<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\SuratMasukController;
use App\Http\Controllers\Api\SuratKeluarController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\NotifikasiController;
use App\Http\Controllers\Api\LaporanController;
use App\Http\Controllers\Api\LogAktivitasController;

// Public Routes
Route::post('/login', [AuthController::class, 'login']);

// Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth & Profile
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Notifikasi
    Route::get('/notifikasi', [NotifikasiController::class, 'index']);
    Route::post('/notifikasi/{id}/read', [NotifikasiController::class, 'markAsRead']);
    Route::post('/notifikasi/read-all', [NotifikasiController::class, 'markAllAsRead']);

    // Staff by Bidang (for forwarding dropdown)
    Route::get('/users/staff-by-bidang/{bidang}', [UserController::class, 'getStaffByBidang']);

    // Surat Masuk
    Route::get('/surat-masuk', [SuratMasukController::class, 'index']);
    Route::get('/surat-masuk/{id}', [SuratMasukController::class, 'show']);
    Route::get('/surat-masuk/{id}/cetak-disposisi', [LaporanController::class, 'cetakDisposisi']);

    Route::middleware('role:admin')->group(function () {
        Route::post('/surat-masuk', [SuratMasukController::class, 'store']);
        Route::post('/surat-masuk/{id}/perbaiki-bidang', [SuratMasukController::class, 'perbaikiBidang']);
        Route::post('/surat-masuk/{id}/arsipkan', [SuratMasukController::class, 'arsipkan']);
        Route::delete('/surat-masuk/{id}', [SuratMasukController::class, 'destroy']);
    });

    Route::middleware('role:kasubid')->group(function () {
        Route::post('/surat-masuk/{id}/teruskan-staff', [SuratMasukController::class, 'teruskanKeStaff']);
        Route::post('/surat-masuk/{id}/perlu-koreksi', [SuratMasukController::class, 'perluKoreksi']);
        Route::post('/surat-masuk/{id}/verifikasi-kasubid', [SuratMasukController::class, 'verifikasiKasubid']);
    });

    Route::middleware('role:staff')->group(function () {
        Route::post('/surat-masuk/{id}/lapor-staff', [SuratMasukController::class, 'laporStaff']);
    });

    Route::middleware('role:kabid')->group(function () {
        Route::post('/surat-masuk/{id}/approve-kabid', [SuratMasukController::class, 'approveKabid']);
    });

    // Surat Keluar (All authenticated users can view, only admin can create/manage)
    Route::middleware('role:admin,kabid,kasubid,staff')->group(function () {
        Route::get('/surat-keluar', [SuratKeluarController::class, 'index']);
        Route::get('/surat-keluar/{id}', [SuratKeluarController::class, 'show']);
    });

    Route::middleware('role:admin')->group(function () {
        Route::post('/surat-keluar', [SuratKeluarController::class, 'store']);
        Route::post('/surat-keluar/{id}/verifikasi-admin', [SuratKeluarController::class, 'verifikasiAdmin']);
        Route::post('/surat-keluar/{id}/arsipkan', [SuratKeluarController::class, 'arsipkan']);
        Route::delete('/surat-keluar/{id}', [SuratKeluarController::class, 'destroy']);
    });

    Route::middleware('role:kabid')->group(function () {
        Route::post('/surat-keluar/{id}/approve-kabid', [SuratKeluarController::class, 'approveKabid']);
        Route::post('/surat-keluar/{id}/kembalikan-kabid', [SuratKeluarController::class, 'kembalikanKabid']);
    });

    // User Management (Admin & Kasubid)
    Route::middleware('role:admin,kasubid')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
    });

    Route::middleware('role:admin')->group(function () {
        Route::patch('/users/{id}/toggle-active', [UserController::class, 'toggleActive']);
        Route::get('/log-aktivitas', [LogAktivitasController::class, 'index']);
    });

    // Laporan (Admin, Kabid, Kasubid)
    Route::middleware('role:admin,kabid,kasubid')->group(function () {
        Route::get('/laporan/rekapitulasi', [LaporanController::class, 'rekapitulasi']);
        Route::get('/laporan/surat-masuk/pdf', [LaporanController::class, 'exportPdfSuratMasuk']);
        Route::get('/laporan/surat-keluar/pdf', [LaporanController::class, 'exportPdfSuratKeluar']);
        Route::get('/laporan/surat-masuk/csv', [LaporanController::class, 'exportCsvSuratMasuk']);
        Route::get('/laporan/surat-keluar/csv', [LaporanController::class, 'exportCsvSuratKeluar']);
    });
});
