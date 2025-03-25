'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { usePoster } from '@/components/PosterContext';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/back-button';

export default function BackgroundSelectionPage() {
  const router = useRouter();
  const { poster, selectBackground } = usePoster();
  
  //Load background options from local storage
  const backgroundOptions = JSON.parse(localStorage.getItem('backgroundOptions') || '[]').map((url: string, i: number) => ({
    id: i,
    name: `Background ${i + 1}`,
    url: url,
  }));

  const handleBackgroundSelect = (backgroundId: string) => {
    selectBackground(backgroundId);
    router.push('/create/editor');
  };

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
            {backgroundOptions.map((background: typeof backgroundOptions[0]) => (
              <div
                key={background.id}
                className={`group relative aspect-[3/4] rounded-lg overflow-hidden cursor-pointer transition-all hover:ring-4 hover:ring-primary/50 ${
                  poster.background?.id === background.id
                    ? 'ring-4 ring-primary'
                    : ''
                }`}
                onClick={() => handleBackgroundSelect(background.id)}
              >
                <img
                  src={background.url}
                  alt={background.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
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