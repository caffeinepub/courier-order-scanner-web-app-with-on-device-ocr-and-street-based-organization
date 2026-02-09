import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, RotateCcw } from 'lucide-react';

interface ImagePreviewProps {
  image: File;
  onConfirm: () => void;
  onRetake: () => void;
}

export function ImagePreview({ image, onConfirm, onRetake }: ImagePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative w-full bg-black rounded-lg overflow-hidden">
          <img src={previewUrl} alt="Preview" className="w-full h-auto" />
        </div>
        <div className="flex gap-3">
          <Button onClick={onRetake} variant="outline" size="lg" className="flex-1 gap-2 h-14 text-lg">
            <RotateCcw className="h-5 w-5" />
            Retake
          </Button>
          <Button onClick={onConfirm} size="lg" className="flex-1 gap-2 h-14 text-lg">
            <Check className="h-5 w-5" />
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
