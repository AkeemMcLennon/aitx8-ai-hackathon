'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { usePoster } from '@/components/PosterContext';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/back-button';
import { LoadingWithFunFacts } from '@/components/ui/loading-with-fun-facts';

interface Background {
  id: string;
  name: string;
  url: string;
}

export default function BackgroundSelectionPage() {
  const router = useRouter();
  const { poster, selectBackground } = usePoster();
  const [backgroundOptions, setBackgroundOptions] = React.useState<Background[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    try {
      const storedOptions = JSON.parse(localStorage.getItem('backgroundOptions') || '[]');
      console.log('Stored background options:', storedOptions);
      
      const options = storedOptions.map((url: string, i: number) => {
        console.log(`Processing URL ${i}:`, url);
        return {
          id: i.toString(),
          name: `Background ${i + 1}`,
          url: url,
        };
      });
      
      console.log('Processed background options:', options);
      setBackgroundOptions(options);
    } catch (error) {
      console.error('Error loading background options:', error);
      setBackgroundOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleBackgroundSelect = (backgroundId: string) => {
    setSelectedId(backgroundId);
    selectBackground(backgroundId);
    
    // Add a small delay to allow the state to update and visual feedback
    setTimeout(() => {
      router.push('/create/editor');
    }, 300);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <Header />
        
        <main className="page-container py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <BackButton href="/create" />
              <div>
                <h1 className="text-3xl font-bold tracking-tighter mb-2">
                  Choose a Background
                </h1>
                <p className="text-gray-600">
                  Select a background for your event poster.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="page-container py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <BackButton href="/create" />
            <div>
              <h1 className="text-3xl font-bold tracking-tighter mb-2">
                Choose a Background
              </h1>
              <p className="text-gray-600">
                Select a background for your event poster.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {backgroundOptions.map((background) => (
              <div
                key={background.id}
                className={`group relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all hover:ring-4 hover:ring-primary/50 ${
                  (selectedId === background.id || poster.background?.id === background.id)
                    ? 'ring-4 ring-primary'
                    : ''
                }`}
                onClick={() => handleBackgroundSelect(background.id)}
              >
                {/* Loading state */}
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10 transition-opacity duration-300">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary"></div>
                </div>
                
                {/* Image container */}
                <div className="relative w-full h-full">
                  <img
                    key={background.url}
                    src={background.url}
                    alt={background.name}
                    className="w-full h-full object-cover transition-opacity duration-300"
                    loading="lazy"
                    onError={(e) => {
                      console.error(`Failed to load image: ${background.url}`);
                      const imgElement = e.target as HTMLImageElement;
                      if (imgElement.src.endsWith('.webp')) {
                        imgElement.src = background.url.replace('.webp', '.png');
                      }
                    }}
                    onLoad={(e) => {
                      console.log(`Successfully loaded image: ${background.url}`);
                      const imgElement = e.target as HTMLImageElement;
                      // Hide the loading spinner
                      const loadingSpinner = imgElement.parentElement?.previousElementSibling as HTMLDivElement;
                      if (loadingSpinner) {
                        loadingSpinner.style.opacity = '0';
                      }
                      // Show the image
                      imgElement.style.opacity = '1';
                    }}
                    style={{ opacity: 0 }}
                  />
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="secondary">Select</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 