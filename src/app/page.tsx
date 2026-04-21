"use client";

import React, { useState, useCallback } from 'react';
import { Sparkles, Layers, Image as ImageIcon, CheckCircle2, ChevronRight, Wand2 } from 'lucide-react';
import { useStudioState, StudioStage } from '@/hooks/useStudioState';
import { ImageInput } from '@/components/studio/ImageInput';
import { BackgroundPanel } from '@/components/studio/BackgroundPanel';
import { Compositor } from '@/components/studio/Compositor';
import { TransformToolbar } from '@/components/studio/TransformToolbar';
import { ExportPanel } from '@/components/studio/ExportPanel';
import { VoiceIndicator } from '@/components/studio/VoiceIndicator';
import { useVoiceCommands, VoiceIntent } from '@/hooks/useVoiceCommands';
import { AIService } from '@/lib/ai-service';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function StudioPage() {
  const { stage, setStage, project, updateProject, updateTransform } = useStudioState();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleImageSelected = async (imageData: string) => {
    updateProject({ originalImage: imageData });
    setStage('edit');

    // Auto-process: Enhance and BG Removal
    setIsProcessing(true);
    try {
      const result = await AIService.processImage(imageData, { enhance: true, removeBackground: true });
      updateProject({ processedImage: result.processedImage });
    } catch (error) {
      console.error('Initial processing failed', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceCommand = useCallback((command: string, intent: VoiceIntent) => {
    console.log('Voice Command:', command, 'Intent:', intent);

    switch (intent) {
      case 'remove_background':
        setStage('background');
        break;
      case 'generate_background':
        setStage('background');
        // Logic to extract prompt from command could be added here
        break;
      case 'set_format':
        setStage('export');
        break;
      default:
        // Show feedback for unknown command
        break;
    }
  }, [setStage]);

  const { isListening, lastTranscript, startListening } = useVoiceCommands({
    onCommand: handleVoiceCommand
  });

  const getCanvasDimensions = () => {
    switch (project.outputFormat) {
      case 'poster': return { width: 640, height: 800 };
      case 'flex': return { width: 800, height: 450 };
      default: return { width: 600, height: 600 };
    }
  };

  const dims = getCanvasDimensions();

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">AI Studio</h1>
        </div>

        {/* Stepper */}
        <nav className="hidden md:flex items-center gap-1">
          {['upload', 'edit', 'background', 'export'].map((s, i) => (
            <React.Fragment key={s}>
              <div className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all",
                stage === s ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" : "text-slate-400"
              )}>
                <span className="w-5 h-5 rounded-full bg-current opacity-20 flex items-center justify-center text-[10px] text-white font-bold">
                  {i + 1}
                </span>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </div>
              {i < 3 && <ChevronRight className="w-4 h-4 text-slate-300" />}
            </React.Fragment>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Reset</Button>
          <Button size="sm" onClick={() => setStage('export')}>Finish</Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {stage === 'upload' ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="space-y-8 text-center">
                <div className="space-y-2">
                  <h2 className="text-4xl font-bold">Create Magic.</h2>
                  <p className="text-slate-500 text-lg">Upload an image and let AI do the rest.</p>
                </div>
                <ImageInput onImageSelected={handleImageSelected} />
              </div>
            </div>
          ) : (
            <>
              {/* Canvas Area */}
              <div className="flex-1 relative">
                {isProcessing && (
                  <div className="absolute inset-0 z-30 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
                    <Wand2 className="w-12 h-12 text-blue-600 animate-pulse" />
                    <p className="font-semibold text-lg">Enhancing & Removing Background...</p>
                  </div>
                )}
                <Compositor
                  project={project}
                  onUpdateTransform={updateTransform}
                  width={dims.width}
                  height={dims.height}
                />
              </div>

              {/* Bottom Toolbar */}
              <TransformToolbar
                transform={project.transform}
                onUpdate={updateTransform}
                onAutoAdjust={() => {}}
              />
            </>
          )}
        </div>

        {/* Right Sidebar Panels */}
        {stage !== 'upload' && (
          <aside className="w-80 h-full flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
            {stage === 'background' || stage === 'edit' ? (
              <BackgroundPanel
                onBackgroundSelect={(type, value) => updateProject({ background: { type, value } })}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />
            ) : stage === 'export' ? (
              <ExportPanel
                currentFormat={project.outputFormat}
                onFormatChange={(format) => updateProject({ outputFormat: format })}
                onExport={(format) => console.log('Exporting as', format)}
              />
            ) : null}
          </aside>
        )}
      </main>

      {/* Voice Control Overlay */}
      <VoiceIndicator
        isListening={isListening}
        transcript={lastTranscript}
        onClick={startListening}
      />

      {/* Tab Switcher for mobile/small screens or quick access */}
      {stage !== 'upload' && (
        <div className="md:hidden fixed bottom-6 left-6 right-6 h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-2xl flex items-center justify-around px-4 z-40">
           <Button variant="ghost" size="icon" onClick={() => setStage('edit')} className={stage === 'edit' ? "text-blue-600" : ""}><Layers className="w-5 h-5" /></Button>
           <Button variant="ghost" size="icon" onClick={() => setStage('background')} className={stage === 'background' ? "text-blue-600" : ""}><ImageIcon className="w-5 h-5" /></Button>
           <Button variant="ghost" size="icon" onClick={() => setStage('export')} className={stage === 'export' ? "text-blue-600" : ""}><CheckCircle2 className="w-5 h-5" /></Button>
        </div>
      )}
    </div>
  );
}
