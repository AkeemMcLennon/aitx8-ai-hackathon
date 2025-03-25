'use client';

import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PosterPreview from '@/components/PosterPreview';
import { PosterData } from '@/types';

const PreviewContent: FC = () => {
  const searchParams = useSearchParams();
  const [posterData, setPosterData] = useState<PosterData>({ assets: [], background: undefined });
  
  useEffect(() => {
    const stateParam = searchParams.get('state');
    if (stateParam) {
      try {
        const state = JSON.parse(decodeURIComponent(stateParam));
        setPosterData(state);
      } catch (error) {
        console.error('Failed to parse state:', error);
      }
    }
  }, [searchParams]);

  // Function to generate CSS string from poster data
  const generateCSS = () => {
    const css = [];
    
    // Container styles
    css.push(`.poster-container {
  position: relative;
  aspect-ratio: 3/4;
  width: 100%;
  max-width: 1200px;
  overflow: hidden;
  border-radius: 0.5rem;
}`);

    // Background styles
    if (posterData.background) {
      css.push(`
.poster-background {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-image: url('${posterData.background.url}');
  background-size: cover;
  background-position: center;
}`);
    }

    // Glass containers
    css.push(`
.glass-container {
  position: absolute;
  left: 0;
  right: 0;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}`);

    // Asset styles
    posterData.assets.forEach((asset, index) => {
      if (asset.type === 'text') {
        css.push(`
.asset-text-${index + 1} {
  position: absolute;
  transform: translate(${asset.x}px, ${asset.y}px) rotate(${asset.rotation || 0}deg);
  color: ${asset.color || '#ffffff'};
  ${index === 0 ? 'font-size: min(5vw, 3rem);' : ''}
  ${index === 1 ? 'font-size: min(3vw, 1.5rem);' : ''}
  ${index === 2 ? 'font-size: min(2.5vw, 1.25rem);' : ''}
  ${index === 3 ? 'font-size: min(2vw, 1rem);' : ''}
  white-space: pre-wrap;
  word-break: break-words;
}`);
      } else if (asset.type === 'logo') {
        css.push(`
.asset-logo-${index + 1} {
  position: absolute;
  transform: translate(${asset.x}px, ${asset.y}px) rotate(${asset.rotation || 0}deg);
  width: ${asset.width}px;
  height: ${asset.height}px;
}`);
      }
    });

    return css.join('\n\n');
  };

  return (
    <div className="flex min-h-screen">
      {/* Preview Section */}
      <div className="w-1/2 p-4 bg-gray-900">
        <div className="sticky top-4">
          <PosterPreview 
            data={posterData}
            background={posterData.background}
            editable={false}
          />
        </div>
      </div>
      
      {/* CSS Section */}
      <div className="w-1/2 p-4 bg-gray-800">
        <div className="sticky top-4">
          <h2 className="text-xl font-bold mb-4 text-white">CSS Transformations</h2>
          <pre className="bg-gray-900 p-4 rounded-lg overflow-auto text-sm text-white font-mono">
            {generateCSS()}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default PreviewContent; 