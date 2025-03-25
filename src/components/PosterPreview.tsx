'use client';

import React, { useEffect, useState } from 'react';
import { PosterData } from '@/types';
import { BackgroundOption } from '@/types';

interface PosterPreviewProps {
  data: PosterData;
  background?: BackgroundOption;
  editable?: boolean;
  className?: string;
}

const PosterPreview: React.FC<PosterPreviewProps> = ({
  data,
  background,
  editable = false,
  className = '',
}) => {
  const [loaded, setLoaded] = useState(false);

  // Reset loading state when background changes
  useEffect(() => {
    setLoaded(false);
  }, [background?.url]);

  if (!background) {
    return (
      <div className={`poster-preview bg-gray-100 aspect-[3/4] flex items-center justify-center ${className}`}>
        <p className="text-gray-500">No background selected</p>
      </div>
    );
  }

  return (
    <div className={`poster-preview ${className} overflow-hidden relative aspect-[3/4]`}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse z-10">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={background.url}
        alt={background.name}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />
      
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        {/* Top title section */}
        <div className="glass-panel p-4 backdrop-blur-md bg-white/20 text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-1 tracking-tight">{data.eventDetails.title}</h2>
          <p className="text-lg opacity-90">{data.eventDetails.location}</p>
        </div>
        
        {/* Bottom date & description section */}
        <div className="glass-panel p-4 backdrop-blur-md bg-black/30 text-white shadow-lg">
          <div className="mb-2">
            <p className="text-lg font-semibold">
              {data.eventDetails.dateTime ? 
                new Date(data.eventDetails.dateTime).toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'Date & Time TBD'}
            </p>
          </div>
          {data.eventDetails.description && (
            <p className="text-sm opacity-90 line-clamp-3">{data.eventDetails.description}</p>
          )}
        </div>
        
        {/* Assets will be rendered here in the editor */}
        {data.assets.map(asset => (
          <div 
            key={asset.id}
            className={`absolute ${editable ? 'cursor-move' : ''}`}
            style={{
              left: `${asset.x}%`,
              top: `${asset.y}%`,
              width: `${asset.width}px`,
              height: `${asset.height}px`,
              transform: `rotate(${asset.rotation}deg)`,
              color: asset.color || 'currentColor',
            }}
          >
            {asset.type === 'text' && (
              <div className="w-full h-full">{asset.content}</div>
            )}
            {asset.type === 'shape' && (
              <div className="w-full h-full bg-current rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PosterPreview; 