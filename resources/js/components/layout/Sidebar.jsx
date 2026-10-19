import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Inbox, Send, Users, FileBarChart, History, Shield, Building2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { clsx } from 'clsx';

export default function Sidebar({ isCollapsed }) {
  const { user } = useAuthStore();

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'kabid', 'kasubid', 'staff'],
    },
    {
      to: '/surat-masuk',
      label: 'Surat Masuk',
      icon: Inbox,
      roles: ['admin', 'kabid', 'kasubid', 'staff'],
    },
    {
      to: '/surat-keluar',
      label: 'Surat Keluar',
      icon: Send,
      roles: ['admin', 'kabid', 'kasubid', 'staff'],
    },
    {
      to: '/manajemen-user',
      label: 'Manajemen Pengguna',
      icon: Users,
      roles: ['admin', 'kasubid'],
    },
    {
      to: '/laporan',
      label: 'Laporan & Rekapitulasi',
      icon: FileBarChart,
      roles: ['admin', 'kabid', 'kasubid'], // Staff excluded
    },
    {
      to: '/log-aktivitas',
      label: 'Log Aktivitas',
      icon: History,
      roles: ['admin'], // Admin only
    },
  ];

  const filteredItems = navItems.filter((item) => item.roles.includes(user?.role));

  return (
    <aside
      className={clsx(
        'fixed inset-y-0 left-0 z-40 bg-[#1A3A5C] text-white flex flex-col transition-all duration-300 shadow-xl border-r border-[#12273e]',
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-4 border-b border-[#244e7c]/60 bg-[#142d47]">
        <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0 shadow-sm text-slate-900 font-black">
          <Building2 className="w-5 h-5 text-slate-900" />
        </div>
        {!isCollapsed && (
          <div className="truncate">
            <h1 className="text-sm font-black tracking-wider text-white">SIMANSUR</h1>
            <p className="text-[10px] text-amber-300/90 font-medium truncate">BPKAD Aset Kota Pekanbaru</p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-btn text-xs font-semibold transition-all duration-150',
                  isActive
                    ? 'bg-accent text-slate-950 font-bold shadow-md shadow-accent/20'
                    : 'text-slate-200 hover:bg-[#244e7c] hover:text-white'
                )
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Institution Identity */}
      <div className="p-3 border-t border-[#244e7c]/50 bg-[#12273e]">
        {!isCollapsed ? (
          <div className="text-[11px] text-slate-400">
            <p className="font-semibold text-slate-300">Pemerintah Kota Pekanbaru</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Sub Bidang Aset BMD</p>
          </div>
        ) : (
          <div className="flex justify-center text-slate-400">
            <Shield className="w-4 h-4" />
          </div>
        )}
      </div>
    </aside>
  );
}
