"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ImageInputProps {
  onImageSelected: (imageData: string) => void;
}

export const ImageInput: React.FC<ImageInputProps> = ({ onImageSelected }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WebP)');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageSelected(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/png');
        stopCamera();
        onImageSelected(imageData);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {!isCameraActive ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative group border-2 border-dashed rounded-xl p-12 transition-all flex flex-col items-center justify-center text-center space-y-4",
            isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600"
          )}
        >
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-2">
            <Upload className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Upload an image</h3>
            <p className="text-slate-500 dark:text-slate-400">Drag and drop your image here, or click to browse</p>
          </div>
          <div className="flex gap-3 pt-4">
            <Button onClick={() => fileInputRef.current?.click()}>
              Choose File
            </Button>
            <Button variant="secondary" onClick={startCamera}>
              <Camera className="w-4 h-4 mr-2" />
              Use Camera
            </Button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-6 inset-x-0 flex justify-center gap-4">
            <Button variant="danger" size="icon" onClick={stopCamera}>
              <X className="w-5 h-5" />
            </Button>
            <Button onClick={capturePhoto} className="rounded-full w-16 h-16 p-0 bg-white hover:bg-slate-100 text-blue-600 border-4 border-blue-600">
              <div className="w-10 h-10 rounded-full bg-blue-600" />
            </Button>
            <Button variant="secondary" size="icon" onClick={() => { stopCamera(); startCamera(); }}>
              <RefreshCw className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {/* Support for presets or tips could go here */}
      </div>
    </div>
  );
};
