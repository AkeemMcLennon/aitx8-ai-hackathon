'use client';

import React, { createContext, useContext, useState } from 'react';
import { EventDetails, PosterData, PosterAsset, BackgroundOption } from '@/types';

// Sample background options
const backgroundOptions: BackgroundOption[] = [
  {
    id: 'bg1',
    name: 'Blue Starry Night',
    url: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'bg2',
    name: 'Yellow Forest',
    url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'bg3',
    name: 'Lake Reflection',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'bg4',
    name: 'Modern Architecture',
    url: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'bg5',
    name: 'Colorful Code',
    url: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'bg6',
    name: 'Matrix Digital Rain',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
  },
];

interface PosterContextType {
  poster: PosterData;
  eventDetails: EventDetails;
  updateEventDetails: (details: EventDetails) => void;
  selectBackground: (backgroundId: string) => void;
  addAsset: (asset: Omit<PosterAsset, 'id'>) => void;
  updateAsset: (id: string, updates: Partial<PosterAsset>) => void;
  removeAsset: (id: string) => void;
  backgroundOptions: BackgroundOption[];
}

const defaultEventDetails: EventDetails = {
  title: '',
  dateTime: '',
  location: '',
  description: '',
};

const PosterContext = createContext<PosterContextType | undefined>(undefined);

export function PosterContextProvider({ children }: { children: React.ReactNode }) {
  const [eventDetails, setEventDetails] = useState<EventDetails>(defaultEventDetails);
  const [poster, setPoster] = useState<PosterData>({
    assets: [],
  });

  const formatDateTime = (dateTimeStr: string) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const updateEventDetails = (details: EventDetails) => {
    setEventDetails(details);

    // Create or update text assets for event details
    const eventAssets: Omit<PosterAsset, 'id'>[] = [
      {
        type: 'text',
        content: details.title,
        color: '#ffffff',
        x: 0,
        y: 0,
        width: 700,
        height: 80,
        rotation: 0,
      },
      {
        type: 'text',
        content: formatDateTime(details.dateTime),
        color: '#ffffff',
        x: 0,
        y: 0,
        width: 400,
        height: 40,
        rotation: 0,
      },
      {
        type: 'text',
        content: details.location,
        color: '#ffffff',
        x: 0,
        y: 0,
        width: 400,
        height: 40,
        rotation: 0,
      },
      {
        type: 'text',
        content: details.description,
        color: '#ffffff',
        x: 0,
        y: 0,
        width: 600,
        height: 120,
        rotation: 0,
      },
    ];

    // Remove existing event detail assets and add new ones
    setPoster((prev) => ({
      ...prev,
      assets: [
        ...eventAssets.map((asset) => ({
          ...asset,
          id: `event_${asset.content.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
        })),
      ],
    }));
  };

  const selectBackground = (backgroundId: string) => {
    const backgrounds = JSON.parse(localStorage.getItem('backgroundOptions') || '[]').map((url: string, i: number) => ({
      id: i,
      name: `Background ${i + 1}`,
      url: url,
    }))
    const background = backgrounds.find((bg: typeof backgrounds[0]) => bg.id === backgroundId);
    setPoster((prev) => ({
      ...prev,
      background,
    }));
  };

  const addAsset = (asset: Omit<PosterAsset, 'id'>) => {
    const newAsset = {
      ...asset,
      id: `asset_${Date.now()}`,
    };
    setPoster((prev) => ({
      ...prev,
      assets: [...prev.assets, newAsset],
    }));
  };

  const updateAsset = (id: string, updates: Partial<PosterAsset>) => {
    setPoster((prev) => ({
      ...prev,
      assets: prev.assets.map((asset) =>
        asset.id === id
          ? {
              ...asset,
              ...updates,
            }
          : asset
      ),
    }));
  };

  const removeAsset = (id: string) => {
    setPoster((prev) => ({
      ...prev,
      assets: prev.assets.filter((asset) => asset.id !== id),
    }));
  };

  return (
    <PosterContext.Provider
      value={{
        poster,
        eventDetails,
        updateEventDetails,
        selectBackground,
        addAsset,
        updateAsset,
        removeAsset,
        backgroundOptions,
      }}
    >
      {children}
    </PosterContext.Provider>
  );
}

export function usePoster() {
  const context = useContext(PosterContext);
  if (context === undefined) {
    throw new Error('usePoster must be used within a PosterContextProvider');
  }
  return context;
} 