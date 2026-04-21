"use client";

import { useState, useCallback } from 'react';

interface VoiceCommandHookOptions {
  onCommand: (command: string, intent: VoiceIntent) => void;
}

export type VoiceIntent =
  | 'remove_background'
  | 'enhance'
  | 'generate_background'
  | 'set_format'
  | 'brightness'
  | 'unknown';

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

export const useVoiceCommands = ({ onCommand }: VoiceCommandHookOptions) => {
  const [isListening, setIsListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');

  const parseIntent = (text: string): VoiceIntent => {
    const t = text.toLowerCase();
    if (t.includes('remove background') || t.includes('cut out')) return 'remove_background';
    if (t.includes('enhance') || t.includes('make it better') || t.includes('brighter')) return 'enhance';
    if (t.includes('background') && (t.includes('add') || t.includes('generate') || t.includes('change'))) return 'generate_background';
    if (t.includes('convert to') || t.includes('format')) return 'set_format';
    return 'unknown';
  };

  const startListening = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setLastTranscript(transcript);
      const intent = parseIntent(transcript);
      onCommand(transcript, intent);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.start();
  }, [onCommand]);

  return {
    isListening,
    lastTranscript,
    startListening,
  };
};
