import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { clsx } from 'clsx';

export default function FileUploadZone({
  onFileSelect,
  selectedFile,
  error,
  label = 'Upload Dokumen Scan Lengkap',
  required = true,
  maxSizeMB = 20,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const validateAndPass = (file) => {
    if (!file) return;
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      alert(`Ukuran berkas (${(file.size / 1024 / 1024).toFixed(1)} MB) melebihi batas maksimal ${maxSizeMB} MB.`);
      return;
    }
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      alert('Format berkas tidak didukung. Harap unggah format PDF, JPG, atau PNG.');
      return;
    }
    onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPass(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndPass(e.target.files[0]);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 tracking-wide">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <span className="text-[11px] text-slate-400">PDF (Multi-halaman) / JPG / PNG (Maks {maxSizeMB} MB)</span>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={clsx(
          'relative border-2 border-dashed rounded-card p-6 text-center cursor-pointer transition-all duration-200',
          isDragOver
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : selectedFile
            ? 'border-emerald-400 bg-emerald-50/40'
            : error
            ? 'border-rose-400 bg-rose-50/30'
            : 'border-slate-300 hover:border-primary hover:bg-slate-50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
        />

        {selectedFile ? (
          <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-emerald-200 shadow-sm text-left">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-900 truncate">{selectedFile.name}</p>
                <p className="text-[11px] text-slate-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type || 'Dokumen'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Siap Unggah
              </span>
              <button
                type="button"
                onClick={handleRemove}
                aria-label="Hapus File"
                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="p-3 rounded-full bg-primary/10 text-primary mb-2">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-800">
              Tarik berkas ke sini atau <span className="text-primary underline">klik untuk memilih</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-sm">
              Satu berkas memuat seluruh isi surat, disposisi, dan berkas pendukung (BAST/BA).
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-1 text-xs text-rose-600 font-medium mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
