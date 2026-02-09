import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';

interface PhotoUploadProps {
  onUpload: (file: File) => void;
}

export function PhotoUpload({ onUpload }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onUpload(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Order Photo</CardTitle>
      </CardHeader>
      <CardContent>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          onClick={() => inputRef.current?.click()}
          size="lg"
          className="w-full gap-3 h-16 text-lg"
        >
          <Upload className="h-6 w-6" />
          Select Photo
        </Button>
      </CardContent>
    </Card>
  );
}
