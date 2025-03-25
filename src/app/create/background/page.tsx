'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { usePoster } from '@/components/PosterContext';
import PosterPreview from '@/components/PosterPreview';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/back-button';

export default function BackgroundSelectionPage() {
  const router = useRouter();
  const { posterData, backgroundOptions, selectBackground, getSelectedBackground } = usePoster();
  const selectedBackground = getSelectedBackground();

  const handleBackgroundSelect = (backgroundId: string) => {
    selectBackground(backgroundId);
  };

  const handleContinue = () => {
    if (selectedBackground) {
      router.push('/create/editor');
    }
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
                Select a background image for your event poster.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
            {/* Preview Section */}
            <div className="order-2 lg:order-1">
              <div className="sticky top-24">
                <h2 className="text-lg font-medium mb-4">Preview</h2>
                <div className="bg-white rounded-lg shadow-sm border p-4">
                  <PosterPreview
                    data={posterData}
                    background={selectedBackground}
                    className="max-w-sm mx-auto"
                  />
                </div>
                
                <Button
                  onClick={handleContinue}
                  className="w-full mt-6"
                  disabled={!selectedBackground}
                >
                  Continue to Editor
                </Button>
              </div>
            </div>
            
            {/* Background Options Grid */}
            <div className="order-1 lg:order-2">
              <h2 className="text-lg font-medium mb-4">Available Backgrounds</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {backgroundOptions.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => handleBackgroundSelect(bg.id)}
                    className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${
                      selectedBackground?.id === bg.id
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <img
                      src={bg.thumbnail}
                      alt={bg.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-white text-sm font-medium">{bg.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 