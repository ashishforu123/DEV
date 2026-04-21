"use client";

import React from 'react';
import { Download, Share2, FileImage, Layout, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface ExportPanelProps {
  onExport: (format: 'png' | 'jpg') => void;
  onFormatChange: (format: 'thumbnail' | 'poster' | 'flex') => void;
  currentFormat: 'thumbnail' | 'poster' | 'flex';
}

const FORMATS = [
  { id: 'thumbnail', name: 'Thumbnail', ratio: '1:1', icon: Smartphone, desc: 'Social profiles' },
  { id: 'poster', name: 'Poster', ratio: '4:5', icon: Layout, desc: 'Print & Instagram' },
  { id: 'flex', name: 'Banner', ratio: '16:9', icon: Monitor, desc: 'YouTube & Web' },
];

export const ExportPanel: React.FC<ExportPanelProps> = ({
  onExport,
  onFormatChange,
  currentFormat
}) => {
  const handleDownload = (format: 'png' | 'jpg') => {
    onExport(format);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-80 p-6 space-y-8">
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Output Format</h3>
        <div className="space-y-3">
          {FORMATS.map((f) => (
            <button
              key={f.id}
              onClick={() => onFormatChange(f.id as "thumbnail" | "poster" | "flex")}
              className={cn(
                "w-full flex items-center p-4 rounded-xl border-2 transition-all text-left",
                currentFormat === f.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center mr-4",
                currentFormat === f.id ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              )}>
                <f.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">{f.name} ({f.ratio})</p>
                <p className="text-xs text-slate-500">{f.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Download</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => handleDownload('png')}>
            <FileImage className="w-4 h-4 mr-2" />
            PNG
          </Button>
          <Button variant="outline" onClick={() => handleDownload('jpg')}>
            <FileImage className="w-4 h-4 mr-2" />
            JPG
          </Button>
        </div>
        <Button className="w-full">
          <Share2 className="w-4 h-4 mr-2" />
          Share Output
        </Button>
      </section>

      <div className="mt-auto p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
        <p className="text-xs text-slate-500 text-center">
          Higher resolutions are available for Pro users.
        </p>
      </div>
    </div>
  );
};
