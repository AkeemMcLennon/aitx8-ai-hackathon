export interface EventDetails {
  title: string;
  location: string;
  description: string;
  dateTime: string;
}

export interface BackgroundOption {
  id: string;
  url: string;
  name: string;
  thumbnail: string;
}

export interface PosterAsset {
  id: string;
  type: 'text' | 'shape' | 'icon';
  content?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color?: string;
}

export interface PosterData {
  eventDetails: EventDetails;
  backgroundId: string | null;
  assets: PosterAsset[];
} 