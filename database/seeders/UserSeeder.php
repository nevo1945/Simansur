<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultPassword = Hash::make('password123');

        // 1. Admin
        $admin = User::firstOrCreate(
            ['username' => 'admin'],
            [
                'nama_lengkap' => 'Administrator Sistem',
                'nip' => '198001012005011001',
                'email' => 'admin@bpkad.pekanbaru.go.id',
                'password' => $defaultPassword,
                'role' => 'admin',
                'bidang' => null,
                'is_active' => true,
            ]
        );

        // 2. Kabid
        $kabid = User::firstOrCreate(
            ['username' => 'kabid'],
            [
                'nama_lengkap' => 'Drs. H. Ahmad Fauzi, M.Si',
                'nip' => '197508121998031002',
                'email' => 'kabid.aset@bpkad.pekanbaru.go.id',
                'password' => $defaultPassword,
                'role' => 'kabid',
                'bidang' => null,
                'is_active' => true,
                'created_by' => $admin->id,
            ]
        );

        // 3. Kasubid IPA (Inventarisasi dan Penghapusan Aset)
        $kasubidIpa = User::firstOrCreate(
            ['username' => 'kasubid.ipa'],
            [
                'nama_lengkap' => 'Budi Santoso, S.STP',
                'nip' => '198203152006041005',
                'email' => 'kasubid.ipa@bpkad.pekanbaru.go.id',
                'password' => $defaultPassword,
                'role' => 'kasubid',
                'bidang' => 'ipa',
                'is_active' => true,
                'created_by' => $admin->id,
            ]
        );

        // 4. Kasubid P3A (Pemanfaatan, Penggunaan, dan Pengamanan Aset)
        $kasubidP3a = User::firstOrCreate(
            ['username' => 'kasubid.p3a'],
            [
                'nama_lengkap' => 'Hendra Wijaya, S.E',
                'nip' => '198406202008011003',
                'email' => 'kasubid.p3a@bpkad.pekanbaru.go.id',
                'password' => $defaultPassword,
                'role' => 'kasubid',
                'bidang' => 'p3a',
                'is_active' => true,
                'created_by' => $admin->id,
            ]
        );

        // 5. Staff IPA (Inventarisasi dan Penghapusan Aset)
        $staffIpa = User::firstOrCreate(
            ['username' => 'staff.ipa'],
            [
                'nama_lengkap' => 'Siti Rahmawati, S.Tr.A.P',
                'nip' => '199201102015031002',
                'email' => 'staff.ipa@bpkad.pekanbaru.go.id',
                'password' => $defaultPassword,
                'role' => 'staff',
                'bidang' => 'ipa',
                'is_active' => true,
                'created_by' => $kasubidIpa->id,
            ]
        );

        // 6. Staff P3A (Pemanfaatan, Penggunaan, dan Pengamanan Aset)
        $staffP3a = User::firstOrCreate(
            ['username' => 'staff.p3a'],
            [
                'nama_lengkap' => 'Rian Pratama, A.Md',
                'nip' => '199407252019021004',
                'email' => 'staff.p3a@bpkad.pekanbaru.go.id',
                'password' => $defaultPassword,
                'role' => 'staff',
                'bidang' => 'p3a',
                'is_active' => true,
                'created_by' => $kasubidP3a->id,
            ]
        );
    }
}
