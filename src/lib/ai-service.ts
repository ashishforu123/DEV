export interface AIProcessingOptions {
  enhance?: boolean;
  removeBackground?: boolean;
  upscale?: boolean;
}

export interface AIGenerationOptions {
  prompt: string;
  style?: string;
  aspectRatio?: '1:1' | '4:5' | '16:9';
}

export class AIService {
  static async processImage(imageData: string, options: AIProcessingOptions): Promise<{ processedImage: string; mask?: string }> {
    const response = await fetch('/api/ai/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageData, options }),
    });

    if (!response.ok) {
      throw new Error('AI processing failed');
    }

    return response.json();
  }

  static async generateBackground(options: AIGenerationOptions): Promise<{ backgroundImage: string }> {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      throw new Error('Background generation failed');
    }

    return response.json();
  }

  static async transcribeAudio(audioBlob: Blob): Promise<{ text: string }> {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    const response = await fetch('/api/voice/transcribe', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Voice transcription failed');
    }

    return response.json();
  }
}
