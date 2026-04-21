"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ImageProject } from '@/hooks/useStudioState';

interface CompositorProps {
  project: ImageProject;
  onUpdateTransform: (updates: Partial<ImageProject['transform']>) => void;
  width?: number;
  height?: number;
}

export const Compositor: React.FC<CompositorProps> = ({
  project,
  onUpdateTransform,
  width = 800,
  height = 800
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<{
    foreground: HTMLImageElement | null;
    background: HTMLImageElement | null;
  }>({ foreground: null, background: null });

  // Load images
  useEffect(() => {
    const loadImg = (src: string | null): Promise<HTMLImageElement | null> => {
      if (!src) return Promise.resolve(null);
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });
    };

    const loadAll = async () => {
      const fg = await loadImg(project.processedImage || project.originalImage);
      const bg = await loadImg(project.background.type === 'color' ? null : project.background.value);
      setImages({ foreground: fg, background: bg });
    };

    loadAll();
  }, [project.processedImage, project.originalImage, project.background]);

  // Render loop
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw Background
    if (project.background.type === 'color') {
      ctx.fillStyle = project.background.value;
      ctx.fillRect(0, 0, width, height);
    } else if (images.background) {
      ctx.drawImage(images.background, 0, 0, width, height);
    }

    // Draw Foreground with transform
    if (images.foreground) {
      ctx.save();

      const { x, y, scale, rotation, opacity } = project.transform;

      // Center and Apply Transforms
      ctx.translate(width / 2 + x, height / 2 + y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.globalAlpha = opacity;

      // Draw centered image
      const dw = images.foreground.width;
      const dh = images.foreground.height;
      const aspect = dw / dh;

      // Fitting logic: adjust based on canvas size
      let renderW = width * 0.8;
      let renderH = renderW / aspect;

      if (renderH > height * 0.8) {
        renderH = height * 0.8;
        renderW = renderH * aspect;
      }

      ctx.drawImage(images.foreground, -renderW / 2, -renderH / 2, renderW, renderH);

      ctx.restore();
    }
  }, [images, project.transform, project.background, width, height]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8 studio-canvas-container overflow-hidden">
      <div className="relative bg-white shadow-2xl rounded-sm overflow-hidden" style={{ width, height }}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="max-w-full max-h-full object-contain cursor-move"
        />
      </div>
    </div>
  );
};
