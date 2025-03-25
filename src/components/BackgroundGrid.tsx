import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BackgroundOption } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import AnimatedTransition from '@/components/ui/AnimatedTransition';

interface BackgroundGridProps {
  options: BackgroundOption[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onConfirm: () => void;
}

const BackgroundGrid: React.FC<BackgroundGridProps> = ({
  options,
  selectedId,
  onSelect,
  onConfirm,
}) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const handleConfirm = () => {
    if (!selectedId) {
      toast({
        title: 'Please select a background',
        description: 'You need to choose a background to continue',
        variant: 'destructive',
      });
      return;
    }
    onConfirm();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-xl font-medium mb-4">Choose a Background</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {options.map((bg) => {
          const isLoaded = loadedImages.has(bg.id);
          const isSelected = bg.id === selectedId;
          
          return (
            <button
              key={bg.id}
              onClick={() => onSelect(bg.id)}
              className={`relative overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-200'
              }`}
              title={bg.name}
            >
              {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src={bg.thumbnail || bg.url}
                alt={bg.name}
                className={`w-full h-full object-cover transition-opacity duration-500 aspect-[4/3] ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => handleImageLoad(bg.id)}
              />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300">
                <AnimatedTransition show={isSelected} className="absolute bottom-0 left-0 right-0 p-2 bg-black/40 text-white text-xs font-medium">
                  {bg.name}
                </AnimatedTransition>
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-6 flex justify-between">
        <Button
          variant="outline"
          className="transition-all hover:bg-secondary"
          onClick={() => window.history.back()}
        >
          Back
        </Button>
        <Button
          className="btn-primary"
          onClick={handleConfirm}
          disabled={!selectedId}
        >
          Continue to Editor
        </Button>
      </div>
    </div>
  );
};

export default BackgroundGrid; 