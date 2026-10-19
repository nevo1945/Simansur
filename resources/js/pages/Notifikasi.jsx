import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, ExternalLink, Clock } from 'lucide-react';
import { getNotifikasiList, markNotifikasiRead, markAllNotifikasiRead } from '../api/notifikasi';
import Breadcrumb from '../components/layout/Breadcrumb';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { formatDateTimeIndo } from '../utils/formatters';

export default function Notifikasi() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['notifikasi-list'],
    queryFn: getNotifikasiList,
  });

  const markAllMutation = useMutation({
    mutationFn: markAllNotifikasiRead,
    onSuccess: () => queryClient.invalidateQueries(['notifikasi-list']),
  });

  const markSingleMutation = useMutation({
    mutationFn: markNotifikasiRead,
    onSuccess: () => queryClient.invalidateQueries(['notifikasi-list']),
  });

  const notifList = data?.data?.notifikasi || [];
  const unreadCount = data?.data?.unread_count || 0;

  const handleClick = (notif) => {
    if (!notif.is_read) {
      markSingleMutation.mutate(notif.id);
    }
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <Breadcrumb items={[{ label: 'Semua Notifikasi' }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Pemberitahuan & Notifikasi</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pemberitahuan surat masuk baru, tindak lanjut staf, dan persetujuan Kepala Bidang
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            icon={CheckCheck}
            isLoading={markAllMutation.isPending}
            onClick={() => markAllMutation.mutate()}
          >
            Tandai Semua Dibaca
          </Button>
        )}
      </div>

      <Card className="divide-y divide-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-500">Memuat notifikasi...</div>
        ) : notifList.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="Tidak Ada Notifikasi"
            description="Semua pemberitahuan telah Anda baca."
          />
        ) : (
          notifList.map((item) => (
            <div
              key={item.id}
              onClick={() => handleClick(item)}
              className={`p-4 flex items-start justify-between gap-4 cursor-pointer transition-colors hover:bg-slate-50 ${
                !item.is_read ? 'bg-primary/5' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-full mt-0.5 shrink-0 ${
                    !item.is_read ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">{item.judul}</h3>
                    {!item.is_read && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.pesan}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 mt-2 font-mono">
                    <Clock className="w-3 h-3" />
                    {formatDateTimeIndo(item.created_at)}
                  </span>
                </div>
              </div>

              {item.link && (
                <div className="shrink-0 text-slate-400 hover:text-primary">
                  <ExternalLink className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
