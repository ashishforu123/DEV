"use client";

import React from 'react';
import { Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceIndicatorProps {
  isListening: boolean;
  transcript?: string;
  onClick: () => void;
}

export const VoiceIndicator: React.FC<VoiceIndicatorProps> = ({ isListening, transcript, onClick }) => {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-50">
      {isListening && transcript && (
        <div className="bg-black/80 text-white px-4 py-2 rounded-full text-sm animate-in fade-in slide-in-from-bottom-2">
          {`"${transcript}"`}
        </div>
      )}
      <button
        onClick={onClick}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg",
          isListening
            ? "bg-red-500 text-white animate-pulse scale-110"
            : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
        )}
      >
        <Mic className="w-6 h-6" />
      </button>
    </div>
  );
};
