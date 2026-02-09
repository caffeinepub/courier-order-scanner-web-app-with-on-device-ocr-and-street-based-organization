import { useState, useEffect } from 'react';
import { useOrders } from '../orders/OrdersProvider';
import { performOCR } from '../ocr/ocr';
import { parseOcrText } from '../ocr/parse';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, AlertCircle, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';

interface OcrReviewFormProps {
  image: File;
  onComplete: () => void;
}

export function OcrReviewForm({ image, onComplete }: OcrReviewFormProps) {
  const { addOrder } = useOrders();
  const [customerName, setCustomerName] = useState('');
  const [street, setStreet] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showManualEntry, setShowManualEntry] = useState(false);

  useEffect(() => {
    processImage();
  }, [image]);

  const processImage = async () => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const text = await performOCR(image, (p) => setProgress(p));

      if (text && text.trim()) {
        const parsed = parseOcrText(text);
        setCustomerName(parsed.customerName);
        setStreet(parsed.street);
      }

      // Show manual entry form after processing
      setShowManualEntry(true);
    } catch (err) {
      console.error('OCR error:', err);
      setShowManualEntry(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if (!customerName.trim() || !street.trim()) {
      toast.error('Please fill in both customer name and street');
      return;
    }

    addOrder({
      customerName: customerName.trim(),
      street: street.trim(),
      completed: false,
    });

    toast.success('Order added successfully');
    onComplete();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter Order Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isProcessing && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm font-medium">Processing image...</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {!isProcessing && showManualEntry && (
          <>
            <Alert>
              <Info className="h-5 w-5" />
              <AlertDescription>
                Please enter the customer name and street from the scanned order.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer-name" className="text-base font-semibold">
                  Customer Name *
                </Label>
                <Input
                  id="customer-name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                  className="h-12 text-base"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="street" className="text-base font-semibold">
                  Street *
                </Label>
                <Input
                  id="street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Enter street name"
                  className="h-12 text-base"
                />
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={!customerName.trim() || !street.trim()}
              size="lg"
              className="w-full gap-2 h-14 text-lg"
            >
              <Save className="h-5 w-5" />
              Save Order
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
