'use client';
import { useCallback, useState } from 'react';
import { Camera, Check } from 'lucide-react';

interface ChartExportButtonProps {
  targetId: string;
  fileName: string;
}

export default function ChartExportButton({ targetId, fileName }: ChartExportButtonProps) {
  const [exporting, setExporting] = useState(false);
  const [done, setDone] = useState(false);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const element = document.getElementById(targetId);
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });

      // Add watermark
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = '14px sans-serif';
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillText('brazilfiscalintelligence.space-z.ai', 10, canvas.height - 10);
      }

      // Download
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  }, [targetId, fileName]);

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="inline-flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-700 transition-colors opacity-0 group-hover:opacity-100"
      title="Exportar como imagem"
      aria-label="Exportar gráfico como PNG"
    >
      {done ? (
        <>
          <Check className="size-3.5 text-green-600" />
          <span className="text-green-600">Exportado!</span>
        </>
      ) : (
        <>
          <Camera className="size-3.5" />
          <span>Exportar</span>
        </>
      )}
    </button>
  );
}
