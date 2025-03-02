export interface Video {
  id: number;
  title: string;
  description: string;
  videoUrl: string; // YouTube video URL or ID
  thumbnail: string;
  views: number;
  timestamp: string;
  tags: string[];
  duration: string;
}