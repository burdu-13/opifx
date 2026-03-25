export interface BatchItem {
  id: string;
  file: File;
  previewUrl: string;
  processedBlob?: Blob;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
}
