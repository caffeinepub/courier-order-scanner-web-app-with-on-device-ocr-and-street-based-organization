import { useState } from 'react';
import { CameraCapture } from './CameraCapture';
import { PhotoUpload } from './PhotoUpload';
import { ImagePreview } from './ImagePreview';
import { OcrReviewForm } from './OcrReviewForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, ArrowLeft } from 'lucide-react';

type Step = 'choose' | 'camera' | 'upload' | 'preview' | 'review';

interface AddOrderFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function AddOrderFlow({ onComplete, onCancel }: AddOrderFlowProps) {
  const [step, setStep] = useState<Step>('choose');
  const [capturedImage, setCapturedImage] = useState<File | null>(null);

  const handleImageCapture = (file: File) => {
    setCapturedImage(file);
    setStep('preview');
  };

  const handleImageUpload = (file: File) => {
    setCapturedImage(file);
    setStep('preview');
  };

  const handlePreviewConfirm = () => {
    setStep('review');
  };

  const handleBack = () => {
    if (step === 'camera' || step === 'upload') {
      setStep('choose');
      setCapturedImage(null);
    } else if (step === 'preview') {
      setStep('choose');
      setCapturedImage(null);
    } else if (step === 'review') {
      setStep('preview');
    } else {
      onCancel();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {step === 'choose' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => setStep('camera')}
                size="lg"
                className="w-full gap-3 h-16 text-lg"
              >
                <Camera className="h-6 w-6" />
                Capture with Camera
              </Button>
              <Button
                onClick={() => setStep('upload')}
                variant="outline"
                size="lg"
                className="w-full gap-3 h-16 text-lg"
              >
                <Upload className="h-6 w-6" />
                Upload Photo
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {step === 'camera' && <CameraCapture onCapture={handleImageCapture} />}

      {step === 'upload' && <PhotoUpload onUpload={handleImageUpload} />}

      {step === 'preview' && capturedImage && (
        <ImagePreview image={capturedImage} onConfirm={handlePreviewConfirm} onRetake={() => setStep('choose')} />
      )}

      {step === 'review' && capturedImage && (
        <OcrReviewForm image={capturedImage} onComplete={onComplete} />
      )}
    </div>
  );
}
