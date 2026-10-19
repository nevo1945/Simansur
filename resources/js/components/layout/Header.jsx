import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bell, Search, User, LogOut, ChevronDown, Check, ShieldCheck, Mail } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getNotifikasiList, markNotifikasiRead, markAllNotifikasiRead } from '../../api/notifikasi';
import { getRoleBadge, formatDateTimeIndo } from '../../utils/formatters';

export default function Header({ toggleSidebar, isSidebarCollapsed }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [notifList, setNotifList] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef(null);
  const userRef = useRef(null);

  const fetchNotif = async () => {
    try {
      const res = await getNotifikasiList();
      if (res.success && res.data) {
        setNotifList(res.data.notifikasi || []);
        setUnreadCount(res.data.unread_count || 0);
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchNotif();
    const interval = setInterval(fetchNotif, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/surat-masuk?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleRead = async (id, link) => {
    try {
      await markNotifikasiRead(id);
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifList((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
      setIsNotifOpen(false);
      if (link) navigate(link);
    } catch (e) {
      // ignore
    }
  };

  const handleReadAll = async () => {
    try {
      await markAllNotifikasiRead();
      setUnreadCount(0);
      setNotifList((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (e) {
      // ignore
    }
  };

  const roleInfo = getRoleBadge(user?.role);

  return (
    <header className="sticky top-0 z-30 gov-header-glass">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Left: Branding & Search */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <button
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
            className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-btn transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <form onSubmit={handleSearch} className="hidden sm:block relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari surat (agenda, nomor, OPD, perihal)..."
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100/80 border border-slate-200 rounded-input focus:bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-slate-900 placeholder:text-slate-400"
            />
          </form>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-3">
          {/* Notifications Popover */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen((prev) => !prev)}
              aria-label="Notifikasi"
              className="relative p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-btn transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-card shadow-gov-modal border border-slate-200 overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">Notifikasi Masuk</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                        {unreadCount} Baru
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleReadAll}
                      className="text-[11px] text-primary hover:underline font-medium"
                    >
                      Tandai semua dibaca
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifList.length > 0 ? (
                    notifList.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleRead(item.id, item.link)}
                        className={`p-3 text-xs cursor-pointer transition-colors hover:bg-slate-50 ${
                          !item.is_read ? 'bg-primary/5 font-medium' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-slate-900 line-clamp-1">{item.judul}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {formatDateTimeIndo(item.created_at)}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-1 line-clamp-2 leading-relaxed">{item.pesan}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400">Tidak ada notifikasi baru</div>
                  )}
                </div>

                <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                  <Link
                    to="/notifikasi"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Lihat Semua Notifikasi
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200" />

          {/* User Profile Popover */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1.5 hover:bg-slate-100 rounded-btn transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                {user?.nama_lengkap ? user.nama_lengkap.substring(0, 2) : 'US'}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-bold text-slate-900 leading-none">{user?.nama_lengkap || 'Pengguna'}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${roleInfo.color}`}>
                    {roleInfo.label}
                  </span>
                  {user?.bidang && (
                    <span className="text-[10px] text-slate-500 capitalize">
                      • Sub Bid. {user.bidang}
                    </span>
                  )}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-card shadow-gov-modal border border-slate-200 overflow-hidden z-50 py-1.5">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60">
                  <p className="text-xs font-bold text-slate-900">{user?.nama_lengkap}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">NIP: {user?.nip || '-'}</p>
                  <p className="text-[11px] text-slate-500">{user?.email || '-'}</p>
                </div>

                <div className="p-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-btn transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar dari SIMANSUR</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
