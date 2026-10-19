import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, FilePlus, CheckCheck, CornerDownLeft, Archive } from 'lucide-react';
import { formatDateTimeIndo, getRoleBadge } from '../../utils/formatters';

export default function TimelineKeluar({ timeline = [] }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-card border border-slate-100">
        Belum ada riwayat alur persetujuan.
      </div>
    );
  }

  const getActionIcon = (jenis) => {
    switch (jenis) {
      case 'input':
        return <FilePlus className="w-3.5 h-3.5 text-blue-600" />;
      case 'verifikasi':
        return <CheckCheck className="w-3.5 h-3.5 text-cyan-600" />;
      case 'approval':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'pengembalian':
        return <CornerDownLeft className="w-3.5 h-3.5 text-rose-600" />;
      case 'arsip':
        return <Archive className="w-3.5 h-3.5 text-slate-600" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getActionBg = (jenis) => {
    switch (jenis) {
      case 'input':
        return 'bg-blue-100 border-blue-300';
      case 'verifikasi':
        return 'bg-cyan-100 border-cyan-300';
      case 'approval':
        return 'bg-emerald-100 border-emerald-300';
      case 'pengembalian':
        return 'bg-rose-100 border-rose-300';
      case 'arsip':
        return 'bg-slate-200 border-slate-400';
      default:
        return 'bg-slate-100 border-slate-300';
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {timeline.map((item, index) => {
        const isLatest = index === timeline.length - 1;
        const roleInfo = getRoleBadge(item.user?.role);

        return (
          <motion.div
            key={item.id || index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
            className="relative"
          >
            <div
              className={`absolute -left-6 top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white ${getActionBg(
                item.jenis
              )} ${isLatest ? 'node-pulse' : ''}`}
            >
              {getActionIcon(item.jenis)}
            </div>

            <div className="bg-white rounded-card p-3.5 border border-slate-200 shadow-sm text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{item.user?.nama_lengkap || 'Pengguna'}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${roleInfo.color}`}>
                    {roleInfo.label}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {formatDateTimeIndo(item.created_at)}
                </span>
              </div>

              <div className="text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100 mt-2 leading-relaxed whitespace-pre-line">
                {item.catatan || 'Tidak ada catatan tambahan.'}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
