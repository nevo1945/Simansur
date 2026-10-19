import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Download, ExternalLink, FileText, Maximize2, Minimize2 } from 'lucide-react';
import { getFileUrl } from '../../utils/formatters';
import Button from '../ui/Button';

export default function PdfViewer({ filePath, title = 'Pratinjau Dokumen Scan' }) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!filePath) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-slate-100 rounded-card border border-slate-200 text-slate-400 p-6">
        <FileText className="w-12 h-12 mb-2 text-slate-300" />
        <p className="text-sm font-medium">Dokumen scan tidak tersedia</p>
      </div>
    );
  }

  const fileUrl = getFileUrl(filePath);
  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(filePath);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);

  return (
    <div className={`flex flex-col bg-slate-900 rounded-card border border-slate-800 overflow-hidden shadow-gov transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 rounded-none' : 'h-[650px] w-full'
    }`}>
      {/* Viewer Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 text-slate-200 border-b border-slate-700 select-none">
        <div className="flex items-center gap-2 truncate max-w-[45%]">
          <FileText className="w-4 h-4 text-accent shrink-0" />
          <span className="text-xs font-semibold truncate">{title}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleZoomOut}
            title="Perkecil (-)"
            aria-label="Perkecil"
            className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-400 px-1">{zoom}%</span>
          <button
            onClick={handleZoomIn}
            title="Perbesar (+)"
            aria-label="Perbesar"
            className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          <button
            onClick={handleRotate}
            title="Putar 90 Derajat"
            aria-label="Putar Dokumen"
            className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
            aria-label="Layar Penuh"
            className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Buka di Tab Baru"
            className="p-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <a
            href={fileUrl}
            download
            title="Unduh Berkas Scan"
            className="p-1.5 bg-primary hover:bg-primary-hover rounded text-white transition-colors ml-1"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Viewer Canvas */}
      <div className="flex-1 bg-slate-950 p-2 overflow-auto flex items-center justify-center relative">
        {isImage ? (
          <div className="flex items-center justify-center p-4 min-w-full min-h-full">
            <img
              src={fileUrl}
              alt="Scan Dokumen"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease-out',
                maxHeight: isFullscreen ? '90vh' : '580px',
              }}
              className="object-contain shadow-2xl rounded"
            />
          </div>
        ) : (
          <iframe
            src={`${fileUrl}#zoom=${zoom}&toolbar=0&navpanes=0`}
            title="PDF Document Preview"
            className="w-full h-full border-0 bg-white rounded"
            style={{
              transform: rotation !== 0 ? `rotate(${rotation}deg)` : 'none',
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease-out',
            }}
          />
        )}
      </div>
    </div>
  );
}
