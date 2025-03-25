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
    glassContainerStyles: Record<string, string>;
    assetStyles: Array<{
      selector: string;
      styles: Record<string, string>;
    }>;
  };
}

export default function PosterPreview({
  data,
  background,
  editable = false,
  className = '',
  customCSS,
}: PosterPreviewProps) {
  const [loading, setLoading] = useState(true);
  const { updateAsset } = usePoster();
  const dragControls = useDragControls();

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
      <div className={`aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Split assets into top (title and date/time) and bottom (location and description)
  const topAssets = data.assets.slice(0, 2);
  const bottomAssets = data.assets.slice(2);

  return (
    <div 
      className={`aspect-[3/4] relative rounded-lg overflow-hidden ${className}`}
      style={{
        ...customCSS?.containerStyles,
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

      {/* Top Info Container with Glass Effect */}
      <div 
        className="absolute top-0 left-0 right-0 p-8 backdrop-blur-md"
        style={{
          ...customCSS?.glassContainerStyles,
          background: customCSS?.glassContainerStyles?.background || 'rgba(0, 0, 0, 0.3)',
          border: customCSS?.glassContainerStyles?.border || '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="max-w-4xl mx-auto">
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
                  onDragEnd={(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
                    handleDragEnd(asset.id, info);
                  }}
                  className="relative"
                >
                  <div 
                    className="whitespace-pre-wrap break-words"
                    style={{
                      color: asset.color || '#ffffff',
                      ...(asset.content === data.assets[0]?.content
                        ? { fontSize: 'min(5vw, 3rem)', fontWeight: 'bold', marginBottom: '0.5rem' }
                        : asset.content === data.assets[1]?.content
                        ? { fontSize: 'min(3vw, 1.5rem)', fontWeight: '500' }
                        : asset.content === data.assets[2]?.content
                        ? { fontSize: 'min(2.5vw, 1.25rem)', fontWeight: '600', marginBottom: '0.5rem' }
                        : { fontSize: 'min(2vw, 1rem)', lineHeight: '1.75' }
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

      {/* Bottom Info Container with Glass Effect */}
      <div 
        className="absolute bottom-0 left-0 right-0 p-8 backdrop-blur-md"
        style={customCSS?.glassContainerStyles}
      >
        <div className="max-w-4xl mx-auto">
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
                  onDragEnd={(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
                    handleDragEnd(asset.id, info);
                  }}
                  className="relative"
                >
                  <div 
                    className="whitespace-pre-wrap break-words"
                    style={{
                      color: asset.color || '#ffffff',
                      ...(asset.content === data.assets[0]?.content
                        ? { fontSize: 'min(5vw, 3rem)', fontWeight: 'bold', marginBottom: '0.5rem' }
                        : asset.content === data.assets[1]?.content
                        ? { fontSize: 'min(3vw, 1.5rem)', fontWeight: '500' }
                        : asset.content === data.assets[2]?.content
                        ? { fontSize: 'min(2.5vw, 1.25rem)', fontWeight: '600', marginBottom: '0.5rem' }
                        : { fontSize: 'min(2vw, 1rem)', lineHeight: '1.75' }
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
              onDragEnd={(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
                handleDragEnd(asset.id, info);
              }}
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