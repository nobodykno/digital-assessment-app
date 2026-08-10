export interface IVideoProcessingJob {
    type: 'thumbnail' | 'quality';
  
    fileId: number;
    userId: number;
  
    objectName: string;
  
    quality?: '360p' | '480p' | '720p' | '1080p';
  }
  