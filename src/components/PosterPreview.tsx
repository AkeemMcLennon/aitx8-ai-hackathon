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
}

export default function PosterPreview({
  data,
  background,
  editable = false,
  className = '',
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

  return (
    <div className={`aspect-[3/4] relative rounded-lg overflow-hidden ${className}`}>
      {background ? (
        <img
          src={background.url}
          alt={background.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <p className="text-gray-400">No background selected</p>
        </div>
      )}

      {data.assets.map((asset) => {
        if (asset.type === 'text') {
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
              <div
                style={{ color: asset.color }}
                className="text-2xl font-bold whitespace-pre-wrap break-words"
              >
                {asset.content}
              </div>
            </motion.div>
          );
        }

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