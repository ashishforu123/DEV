"use client";

import React from 'react';
import { Move, Maximize, RotateCcw, Ghost, Sun, Palette } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TransformToolbarProps {
  transform: {
    x: number;
    y: number;
    scale: number;
    rotation: number;
    opacity: number;
  };
  onUpdate: (updates: Partial<TransformToolbarProps['transform']>) => void;
  onAutoAdjust: () => void;
}

export const TransformToolbar: React.FC<TransformToolbarProps> = ({
  transform,
  onUpdate,
  onAutoAdjust
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8">
        {/* Scale */}
        <div className="flex items-center gap-3">
          <Maximize className="w-4 h-4 text-slate-400" />
          <div className="w-32">
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.05"
              value={transform.scale}
              onChange={(e) => onUpdate({ scale: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <span className="text-xs font-mono w-8">{Math.round(transform.scale * 100)}%</span>
        </div>

        {/* Rotation */}
        <div className="flex items-center gap-3">
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <div className="w-32">
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={transform.rotation}
              onChange={(e) => onUpdate({ rotation: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <span className="text-xs font-mono w-8">{transform.rotation}°</span>
        </div>

        {/* Opacity */}
        <div className="flex items-center gap-3">
          <Ghost className="w-4 h-4 text-slate-400" />
          <div className="w-32">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={transform.opacity}
              onChange={(e) => onUpdate({ opacity: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <span className="text-xs font-mono w-8">{Math.round(transform.opacity * 100)}%</span>
        </div>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Auto Adjust */}
        <Button variant="secondary" size="sm" onClick={onAutoAdjust}>
          <Sun className="w-4 h-4 mr-2" />
          Auto Match
        </Button>
      </div>
    </div>
  );
};
