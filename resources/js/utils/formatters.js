export function formatDateIndo(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d);
  } catch (e) {
    return dateStr;
  }
}

export function formatDateTimeIndo(dateTimeStr) {
  if (!dateTimeStr) return '-';
  try {
    const d = new Date(dateTimeStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  } catch (e) {
    return dateTimeStr;
  }
}

export function getFileUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `/storage/${path.replace(/^\/+/, '')}`;
}

export function getStatusInfo(status) {
  switch (status) {
    case 'baru':
      return {
        label: 'Menunggu Telaah Kabid',
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        desc: 'Surat baru diinput Admin, menunggu persetujuan & arahan disposisi Kepala Bidang'
      };
    case 'diteruskan_kasubid':
      return {
        label: 'Disposisi Kasubid',
        bg: 'bg-sky-50 text-sky-700 border-sky-200',
        dot: 'bg-sky-500',
        desc: 'Disetujui Kabid & didisposisikan ke Kasubid, menunggu penugasan staf'
      };
    case 'diteruskan_staff':
      return {
        label: 'Diteruskan ke Staf',
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
        desc: 'Kasubid menugaskan staf untuk pelaksanaan fisik/lapangan'
      };
    case 'selesai_staff':
      return {
        label: 'Selesai Staf',
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        dot: 'bg-indigo-500',
        desc: 'Staf telah melaporkan hasil tindak lanjut, menunggu verifikasi Kasubid'
      };
    case 'terverifikasi_kasubid':
      return {
        label: 'Terverifikasi Kasubid',
        bg: 'bg-secondary/10 text-secondary border-secondary/30',
        dot: 'bg-secondary',
        desc: 'Tindak lanjut telah diverifikasi Kasubid, siap diarsipkan Admin'
      };
    case 'disetujui_kabid':
      return {
        label: 'Disetujui Kabid',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        desc: 'Telah disetujui Kepala Bidang, siap diarsipkan Admin'
      };
    case 'diarsipkan':
      return {
        label: 'Diarsipkan',
        bg: 'bg-slate-100 text-slate-700 border-slate-300',
        dot: 'bg-slate-500',
        desc: 'Surat telah tersimpan rapi dalam arsip digital'
      };
    case 'perlu_koreksi':
      return {
        label: 'Perlu Koreksi',
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        desc: 'Dikembalikan Kasubid untuk penyesuaian disposisi/bidang oleh Kabid'
      };
    // Status Surat Keluar
    case 'diinput':
      return {
        label: 'Draft Terinput',
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        desc: 'Surat keluar diinput Admin, menunggu verifikasi kelengkapan'
      };
    case 'diverifikasi_admin':
      return {
        label: 'Diverifikasi Admin',
        bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
        dot: 'bg-cyan-500',
        desc: 'Admin telah memverifikasi dokumen, menunggu persetujuan Kabid'
      };
    case 'dikembalikan':
      return {
        label: 'Dikembalikan Kabid',
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        desc: 'Kabid meminta perbaikan data surat keluar sebelum persetujuan'
      };
    default:
      return {
        label: status || '-',
        bg: 'bg-gray-100 text-gray-700 border-gray-200',
        dot: 'bg-gray-400',
        desc: ''
      };
  }
}

export function getSifatBadge(sifat) {
  switch (sifat) {
    case 'penting':
      return { label: 'Penting', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
    case 'segera':
      return { label: 'Segera', bg: 'bg-orange-100 text-orange-800 border-orange-300' };
    case 'rahasia':
      return { label: 'Rahasia', bg: 'bg-rose-100 text-rose-800 border-rose-300' };
    case 'biasa':
    default:
      return { label: 'Biasa', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
  }
}

export function getRoleBadge(role) {
  switch (role) {
    case 'admin':
      return { label: 'Admin BPKAD', color: 'bg-primary text-white' };
    case 'kabid':
      return { label: 'Kepala Bidang', color: 'bg-accent text-slate-900 font-bold' };
    case 'kasubid':
      return { label: 'Kepala Sub Bidang', color: 'bg-secondary text-white' };
    case 'staff':
      return { label: 'Staf Teknis', color: 'bg-slate-200 text-slate-800' };
    default:
      return { label: role, color: 'bg-gray-200 text-gray-700' };
  }
}

export function getBidangLabel(bidang) {
  switch (bidang) {
    case 'ipa':
      return 'IPA – Inventarisasi & Penghapusan Aset';
    case 'p3a':
      return 'P3A – Pemanfaatan, Penggunaan & Pengamanan Aset';
    default:
      return bidang ? bidang.toUpperCase() : '-';
  }
}

export function getBidangShortLabel(bidang) {
  switch (bidang) {
    case 'ipa':
      return 'Sub Bid. IPA';
    case 'p3a':
      return 'Sub Bid. P3A';
    default:
      return bidang ? `Sub Bid. ${bidang.toUpperCase()}` : '-';
  }
}
