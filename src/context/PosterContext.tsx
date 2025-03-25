import React, { createContext, useContext, useState } from 'react';
import { EventDetails, PosterData, PosterAsset, BackgroundOption } from '../types';

// Sample background options
const backgroundOptions: BackgroundOption[] = [
  {
    id: 'bg1',
    url: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb',
    name: 'Blue Starry Night',
    thumbnail: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=200&h=150&fit=crop',
  },
  {
    id: 'bg2',
    url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
    name: 'Yellow Forest',
    thumbnail: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=200&h=150&fit=crop',
  },
  {
    id: 'bg3',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    name: 'Lake Reflection',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&h=150&fit=crop',
  },
  {
    id: 'bg4',
    url: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b',
    name: 'Modern Architecture',
    thumbnail: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=200&h=150&fit=crop',
  },
  {
    id: 'bg5',
    url: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    name: 'Colorful Code',
    thumbnail: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=200&h=150&fit=crop',
  },
  {
    id: 'bg6',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    name: 'Matrix Digital Rain',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&h=150&fit=crop',
  },
];

interface PosterContextType {
  posterData: PosterData;
  updateEventDetails: (details: EventDetails) => void;
  selectBackground: (backgroundId: string) => void;
  addAsset: (asset: Omit<PosterAsset, 'id'>) => void;
  updateAsset: (id: string, updates: Partial<PosterAsset>) => void;
  removeAsset: (id: string) => void;
  backgroundOptions: BackgroundOption[];
  getSelectedBackground: () => BackgroundOption | undefined;
  resetPoster: () => void;
}

const defaultPosterData: PosterData = {
  eventDetails: {
    title: '',
    location: '',
    description: '',
    dateTime: '',
  },
  backgroundId: null,
  assets: [],
};

const PosterContext = createContext<PosterContextType | undefined>(undefined);

export const PosterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posterData, setPosterData] = useState<PosterData>(defaultPosterData);

  const updateEventDetails = (details: EventDetails) => {
    setPosterData(prev => ({
      ...prev,
      eventDetails: details,
    }));
  };

  const selectBackground = (backgroundId: string) => {
    setPosterData(prev => ({
      ...prev,
      backgroundId,
    }));
  };

  const addAsset = (asset: Omit<PosterAsset, 'id'>) => {
    const newAsset = {
      ...asset,
      id: `asset_${Date.now()}`,
    };
    
    setPosterData(prev => ({
      ...prev,
      assets: [...prev.assets, newAsset],
    }));
  };

  const updateAsset = (id: string, updates: Partial<PosterAsset>) => {
    setPosterData(prev => ({
      ...prev,
      assets: prev.assets.map(asset => 
        asset.id === id ? { ...asset, ...updates } : asset
      ),
    }));
  };

  const removeAsset = (id: string) => {
    setPosterData(prev => ({
      ...prev,
      assets: prev.assets.filter(asset => asset.id !== id),
    }));
  };

  const getSelectedBackground = () => {
    if (!posterData.backgroundId) return undefined;
    return backgroundOptions.find(bg => bg.id === posterData.backgroundId);
  };

  const resetPoster = () => {
    setPosterData(defaultPosterData);
  };

  return (
    <PosterContext.Provider
      value={{
        posterData,
        updateEventDetails,
        selectBackground,
        addAsset,
        updateAsset,
        removeAsset,
        backgroundOptions,
        getSelectedBackground,
        resetPoster,
      }}
    >
      {children}
    </PosterContext.Provider>
  );
};

export const usePoster = () => {
  const context = useContext(PosterContext);
  if (context === undefined) {
    throw new Error('usePoster must be used within a PosterProvider');
  }
  return context;
}; 