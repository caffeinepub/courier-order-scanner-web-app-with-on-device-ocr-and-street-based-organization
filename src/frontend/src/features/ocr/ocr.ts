// Mock OCR implementation since tesseract.js cannot be added to the read-only package.json
// This provides a simulated OCR experience with manual entry fallback

export async function performOCR(
  image: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  // Simulate OCR processing with progress updates
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (onProgress) {
        onProgress(Math.min(progress, 100));
      }
      if (progress >= 100) {
        clearInterval(interval);
        // Return empty string to trigger manual entry
        // In a real implementation, this would use an OCR library
        resolve('');
      }
    }, 200);
  });
}
