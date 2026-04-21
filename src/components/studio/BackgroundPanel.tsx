"use client";

import React, { useState } from 'react';
import { Image as ImageIcon, Sparkles, Upload, Palette } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { AIService } from '@/lib/ai-service';

interface BackgroundPanelProps {
  onBackgroundSelect: (type: 'color' | 'image' | 'generated', value: string) => void;
  isGenerating?: boolean;
  setIsGenerating: (loading: boolean) => void;
}

const PRESET_STYLES = [
  { id: 'studio', name: 'Studio', prompt: 'minimalist professional studio background, soft lighting' },
  { id: 'outdoor', name: 'Outdoor', prompt: 'scenic nature park, bokeh background, sunny day' },
  { id: 'abstract', name: 'Abstract', prompt: 'modern abstract gradient background, professional' },
  { id: 'festive', name: 'Festive', prompt: 'celebration background with sparkles and warm lights' },
];

const COLORS = [
  '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#000000',
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'
];

export const BackgroundPanel: React.FC<BackgroundPanelProps> = ({
  onBackgroundSelect,
  isGenerating,
  setIsGenerating
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'generate'>('presets');
  const [prompt, setPrompt] = useState('');

  const handleGenerate = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt) return;

    setIsGenerating(true);
    try {
      const result = await AIService.generateBackground({ prompt: finalPrompt });
      onBackgroundSelect('generated', result.backgroundImage);
    } catch (error) {
      alert('Failed to generate background. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-80">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-blue-500" />
          Background
        </h2>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('presets')}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors",
            activeTab === 'presets' ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Presets
        </button>
        <button
          onClick={() => setActiveTab('generate')}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors",
            activeTab === 'generate' ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-700"
          )}
        >
          AI Generate
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {activeTab === 'presets' && (
          <div className="space-y-4">
            <section>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Styles</h3>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => handleGenerate(style.prompt)}
                    disabled={isGenerating}
                    className="group relative aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all text-left"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                      <span className="text-white text-xs font-medium">{style.name}</span>
                    </div>
                    {isGenerating && style.prompt === prompt && (
                      <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Colors</h3>
              <div className="grid grid-cols-5 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => onBackgroundSelect('color', color)}
                    className="w-full aspect-square rounded-md border border-slate-200 dark:border-slate-700"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'generate' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Describe your background</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. 'Cyberpunk city at night', 'Quiet mountain lake'..."
                className="w-full h-32 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <Button
              onClick={() => handleGenerate()}
              disabled={isGenerating || !prompt}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
