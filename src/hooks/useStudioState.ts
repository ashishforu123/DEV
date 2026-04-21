import { useState, useCallback } from 'react';

export type StudioStage = 'upload' | 'edit' | 'background' | 'customize' | 'export';

export interface ImageProject {
  id: string;
  originalImage: string | null;
  processedImage: string | null;
  mask: string | null;
  background: {
    type: 'color' | 'image' | 'generated';
    value: string;
  };
  transform: {
    x: number;
    y: number;
    scale: number;
    rotation: number;
    opacity: number;
  };
  outputFormat: 'thumbnail' | 'poster' | 'flex';
}

export const useStudioState = () => {
  const [stage, setStage] = useState<StudioStage>('upload');
  const [project, setProject] = useState<ImageProject>({
    id: crypto.randomUUID(),
    originalImage: null,
    processedImage: null,
    mask: null,
    background: {
      type: 'color',
      value: '#ffffff',
    },
    transform: {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      opacity: 1,
    },
    outputFormat: 'thumbnail',
  });

  const updateProject = useCallback((updates: Partial<ImageProject>) => {
    setProject((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateTransform = useCallback((updates: Partial<ImageProject['transform']>) => {
    setProject((prev) => ({
      ...prev,
      transform: { ...prev.transform, ...updates },
    }));
  }, []);

  return {
    stage,
    setStage,
    project,
    setProject,
    updateProject,
    updateTransform,
  };
};
