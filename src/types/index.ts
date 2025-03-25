export interface EventDetails {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export interface PosterAsset {
  id: string;
  type: 'text' | 'logo';
  content: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  color?: string;
  url?: string;
  file?: File;
}

export interface BackgroundOption {
  id: string;
  name: string;
  url: string;
}

export interface PosterData {
  assets: PosterAsset[];
  background?: BackgroundOption;
}

export interface AssetTransform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
} 