'use client';

import React, { useEffect, useState } from 'react';
import { PosterData, BackgroundOption } from '@/types';
import { usePoster } from './PosterContext';
import { motion, useDragControls, PanInfo } from 'framer-motion';

interface PosterPreviewProps {
  data: PosterData;
  background?: BackgroundOption;
  editable?: boolean;
  className?: string;
  customCSS?: {
    containerStyles: Record<string, string>;
    backgroundStyles: Record<string, string>;
    textContainerStyles: Array<{
      selector: string;
      styles: Record<string, string>;
    }>;
    assetStyles: Array<{
      selector: string;
      styles: Record<string, string>;
    }>;
  };
}

// Helper function to calculate container dimensions based on aspect ratio
const getContainerStyles = (aspectRatio: string = '4:5') => {
  const [width, height] = aspectRatio.split(':').map(Number);
  const isLandscape = width > height;
  const isSquare = width === height;
  
  // Significantly reduce padding for landscape mode
  const paddingMultiplier = isLandscape ? 0.02 : isSquare ? 0.06 : 0.04;
  
  // Reduce font size multiplier for landscape mode
  const fontSizeMultiplier = isLandscape ? 0.6 : isSquare ? 0.9 : 0.7;
  
  return {
    containerAspectRatio: `${width}/${height}`,
    padding: `${paddingMultiplier * 100}%`,
    fontSizeMultiplier,
    isLandscape,
    isSquare
  };
};

export default function PosterPreview({
  data,
  background,
  editable = false,
  className = '',
  customCSS,
}: PosterPreviewProps) {
  const [loading, setLoading] = useState(true);
  const { updateAsset, eventDetails } = usePoster();
  const dragControls = useDragControls();
  const containerStyles = getContainerStyles(eventDetails?.aspectRatio);

  useEffect(() => {
    if (background?.url) {
      const img = new Image();
      img.src = background.url;
      img.onload = () => setLoading(false);
    } else {
      setLoading(false);
    }
  }, [background?.url]);

  const handleDragEnd = (assetId: string, info: PanInfo) => {
    updateAsset(assetId, {
      x: info.point.x,
      y: info.point.y,
    });
  };

  if (loading) {
    return (
      <div 
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ 
          aspectRatio: containerStyles.containerAspectRatio,
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Split assets into top (title and date/time) and bottom (location and description)
  const topAssets = data.assets.slice(0, 2);
  const bottomAssets = data.assets.slice(2);

  return (
    <div 
      className={`relative rounded-lg overflow-hidden ${className}`}
      style={{
        ...customCSS?.containerStyles,
        aspectRatio: containerStyles.containerAspectRatio,
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto'
      }}
    >
      {background ? (
        <img
          src={background.url}
          alt={background.name}
          className="absolute inset-0 w-full h-full object-cover"
          style={customCSS?.backgroundStyles}
        />
      ) : (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-400">No background selected</p>
        </div>
      )}

      {/* Text containers with responsive layout */}
      <div className={`absolute inset-0 flex ${containerStyles.isLandscape ? 'flex-col justify-between' : 'flex-col justify-between'}`}>
        {containerStyles.isLandscape ? (
          <>
            {/* Top text container (location & description) for landscape */}
            <div 
              className="backdrop-blur-md w-full"
              style={{
                ...customCSS?.textContainerStyles?.[1]?.styles,
                background: customCSS?.textContainerStyles?.[1]?.styles?.background || 'rgba(0, 0, 0, 0.3)',
                border: customCSS?.textContainerStyles?.[1]?.styles?.border || '1px solid rgba(255, 255, 255, 0.1)',
                padding: containerStyles.padding
              }}
            >
              <div className="relative">
                {bottomAssets.map((asset, index) => {
                  if (asset.type === 'text') {
                    const assetStyles = customCSS?.assetStyles.find(
                      style => style.selector === `.asset-text-${index + 3}`
                    )?.styles;
                    
                    return (
                      <motion.div
                        key={asset.id}
                        style={{
                          x: asset.x,
                          y: asset.y,
                          rotate: asset.rotation,
                        }}
                        drag={editable}
                        dragControls={dragControls}
                        dragMomentum={false}
                        onDragEnd={(_event, info) => handleDragEnd(asset.id, info)}
                        className="relative"
                      >
                        <div 
                          className="whitespace-pre-wrap break-words"
                          style={{
                            color: asset.color || '#ffffff',
                            ...(index === 0
                              ? { 
                                  fontSize: `calc(${containerStyles.fontSizeMultiplier} * min(2vw, 1rem))`,
                                  fontWeight: '600',
                                  marginBottom: '0.15rem',
                                  lineHeight: '1.2'
                                }
                              : { 
                                  fontSize: `calc(${containerStyles.fontSizeMultiplier} * min(1.6vw, 0.8rem))`,
                                  lineHeight: '1.4'
                                }
                            ),
                            ...assetStyles
                          }}
                        >
                          {asset.content}
                        </div>
                      </motion.div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            {/* Bottom text container (title & date) for landscape */}
            <div 
              className="backdrop-blur-md w-full"
              style={{
                ...customCSS?.textContainerStyles?.[0]?.styles,
                background: customCSS?.textContainerStyles?.[0]?.styles?.background || 'rgba(0, 0, 0, 0.3)',
                border: customCSS?.textContainerStyles?.[0]?.styles?.border || '1px solid rgba(255, 255, 255, 0.1)',
                padding: containerStyles.padding
              }}
            >
              <div className="relative">
                {topAssets.map((asset, index) => {
                  if (asset.type === 'text') {
                    const assetStyles = customCSS?.assetStyles.find(
                      style => style.selector === `.asset-text-${index + 1}`
                    )?.styles;
                    
                    return (
                      <motion.div
                        key={asset.id}
                        style={{
                          x: asset.x,
                          y: asset.y,
                          rotate: asset.rotation,
                        }}
                        drag={editable}
                        dragControls={dragControls}
                        dragMomentum={false}
                        onDragEnd={(_event, info) => handleDragEnd(asset.id, info)}
                        className="relative"
                      >
                        <div 
                          className="whitespace-pre-wrap break-words"
                          style={{
                            color: asset.color || '#ffffff',
                            ...(index === 0
                              ? { 
                                  fontSize: `calc(${containerStyles.fontSizeMultiplier} * min(3.5vw, 1.8rem))`,
                                  fontWeight: 'bold',
                                  marginBottom: '0.15rem',
                                  lineHeight: '1.1'
                                }
                              : { 
                                  fontSize: `calc(${containerStyles.fontSizeMultiplier} * min(2vw, 1rem))`,
                                  fontWeight: '500',
                                  lineHeight: '1.2'
                                }
                            ),
                            ...assetStyles
                          }}
                        >
                          {asset.content}
                        </div>
                      </motion.div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Original portrait layout */}
            <div 
              className="backdrop-blur-md w-full"
              style={{
                ...customCSS?.textContainerStyles?.[0]?.styles,
                background: customCSS?.textContainerStyles?.[0]?.styles?.background || 'rgba(0, 0, 0, 0.3)',
                border: customCSS?.textContainerStyles?.[0]?.styles?.border || '1px solid rgba(255, 255, 255, 0.1)',
                padding: containerStyles.padding
              }}
            >
              <div className="relative">
                {topAssets.map((asset, index) => {
                  if (asset.type === 'text') {
                    const assetStyles = customCSS?.assetStyles.find(
                      style => style.selector === `.asset-text-${index + 1}`
                    )?.styles;
                    
                    return (
                      <motion.div
                        key={asset.id}
                        style={{
                          x: asset.x,
                          y: asset.y,
                          rotate: asset.rotation,
                        }}
                        drag={editable}
                        dragControls={dragControls}
                        dragMomentum={false}
                        onDragEnd={(_event, info) => handleDragEnd(asset.id, info)}
                        className="relative"
                      >
                        <div 
                          className="whitespace-pre-wrap break-words"
                          style={{
                            color: asset.color || '#ffffff',
                            ...(index === 0
                              ? { 
                                  fontSize: `calc(${containerStyles.fontSizeMultiplier} * min(4vw, 2.5rem))`,
                                  fontWeight: 'bold',
                                  marginBottom: '0.25rem',
                                  lineHeight: '1.2'
                                }
                              : { 
                                  fontSize: `calc(${containerStyles.fontSizeMultiplier} * min(2.5vw, 1.25rem))`,
                                  fontWeight: '500',
                                  lineHeight: '1.3'
                                }
                            ),
                            ...assetStyles
                          }}
                        >
                          {asset.content}
                        </div>
                      </motion.div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            <div 
              className="backdrop-blur-md w-full"
              style={{
                ...customCSS?.textContainerStyles?.[1]?.styles,
                background: customCSS?.textContainerStyles?.[1]?.styles?.background || 'rgba(0, 0, 0, 0.3)',
                border: customCSS?.textContainerStyles?.[1]?.styles?.border || '1px solid rgba(255, 255, 255, 0.1)',
                padding: containerStyles.padding
              }}
            >
              <div className="relative">
                {bottomAssets.map((asset, index) => {
                  if (asset.type === 'text') {
                    const assetStyles = customCSS?.assetStyles.find(
                      style => style.selector === `.asset-text-${index + 3}`
                    )?.styles;
                    
                    return (
                      <motion.div
                        key={asset.id}
                        style={{
                          x: asset.x,
                          y: asset.y,
                          rotate: asset.rotation,
                        }}
                        drag={editable}
                        dragControls={dragControls}
                        dragMomentum={false}
                        onDragEnd={(_event, info) => handleDragEnd(asset.id, info)}
                        className="relative"
                      >
                        <div 
                          className="whitespace-pre-wrap break-words"
                          style={{
                            color: asset.color || '#ffffff',
                            ...(index === 0
                              ? { 
                                  fontSize: `calc(${containerStyles.fontSizeMultiplier} * min(2.2vw, 1.1rem))`,
                                  fontWeight: '600',
                                  marginBottom: '0.25rem',
                                  lineHeight: '1.3'
                                }
                              : { 
                                  fontSize: `calc(${containerStyles.fontSizeMultiplier} * min(1.8vw, 0.9rem))`,
                                  lineHeight: '1.5'
                                }
                            ),
                            ...assetStyles
                          }}
                        >
                          {asset.content}
                        </div>
                      </motion.div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Logos can be placed anywhere */}
      {data.assets.map((asset) => {
        if (asset.type === 'logo' && asset.url) {
          return (
            <motion.div
              key={asset.id}
              style={{
                x: asset.x,
                y: asset.y,
                width: asset.width,
                height: asset.height,
                rotate: asset.rotation,
              }}
              drag={editable}
              dragControls={dragControls}
              dragMomentum={false}
              onDragEnd={(_event, info) => handleDragEnd(asset.id, info)}
              className="absolute cursor-move"
            >
              <img
                src={asset.url}
                alt={asset.content}
                className="w-full h-full object-contain"
              />
              {editable && (
                <div className="absolute inset-0 ring-2 ring-primary/50 rounded pointer-events-none" />
              )}
            </motion.div>
          );
        }
        return null;
      })}
    </div>
  );
} 