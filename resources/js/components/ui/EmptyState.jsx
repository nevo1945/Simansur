import React from 'react';
import { FileText } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = FileText,
  title = 'Tidak Ada Data',
  description = 'Belum ada dokumen atau data yang tercatat untuk filter ini.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-white rounded-card border border-dashed border-slate-200 my-4">
      <div className="p-4 rounded-full bg-slate-100 text-slate-400 mb-3">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      <p className="mt-1 text-xs text-slate-500 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
