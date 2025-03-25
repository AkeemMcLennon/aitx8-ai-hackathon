'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { usePoster } from '@/components/PosterContext';
import PosterPreview from '@/components/PosterPreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { PosterAsset } from '@/types';

export default function EditorPage() {
  const router = useRouter();
  const { posterData, getSelectedBackground, addAsset, updateAsset, removeAsset } = usePoster();
  const selectedBackground = getSelectedBackground();
  const { toast } = useToast();
  
  const [newAsset, setNewAsset] = useState<Omit<PosterAsset, 'id'>>({
    type: 'text',
    content: '',
    x: 50,
    y: 50,
    width: 200,
    height: 40,
    rotation: 0,
    color: '#ffffff',
  });

  const handleAddAsset = () => {
    if (newAsset.type === 'text' && !newAsset.content) {
      toast({
        title: 'Error',
        description: 'Please enter text content',
        variant: 'destructive',
      });
      return;
    }
    
    addAsset(newAsset);
    setNewAsset({
      type: 'text',
      content: '',
      x: 50,
      y: 50,
      width: 200,
      height: 40,
      rotation: 0,
      color: '#ffffff',
    });
  };

  const handleAssetChange = (id: string, updates: Partial<PosterAsset>) => {
    updateAsset(id, updates);
  };

  const handleAssetRemove = (id: string) => {
    removeAsset(id);
  };

  const handleDownload = () => {
    // TODO: Implement poster download functionality
    toast({
      title: 'Coming Soon',
      description: 'Download functionality will be available soon!',
    });
  };

  if (!selectedBackground) {
    router.push('/create/background');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="page-container py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tighter mb-2">
              Customize Your Poster
            </h1>
            <p className="text-gray-600">
              Add text and shapes to make your poster unique.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
            {/* Controls Section */}
            <div className="order-2 lg:order-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-medium mb-4">Add Elements</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="content">Text Content</Label>
                      <Input
                        id="content"
                        value={newAsset.content}
                        onChange={(e) => setNewAsset(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Enter text"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="color">Text Color</Label>
                      <Input
                        id="color"
                        type="color"
                        value={newAsset.color}
                        onChange={(e) => setNewAsset(prev => ({ ...prev, color: e.target.value }))}
                      />
                    </div>
                    
                    <Button onClick={handleAddAsset} className="w-full">
                      Add Text
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-medium mb-4">Existing Elements</h2>
                  <div className="space-y-4">
                    {posterData.assets.map((asset) => (
                      <div key={asset.id} className="flex items-center gap-4">
                        <Input
                          value={asset.content}
                          onChange={(e) => handleAssetChange(asset.id, { content: e.target.value })}
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleAssetRemove(asset.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button onClick={handleDownload} className="w-full">
                  Download Poster
                </Button>
              </div>
            </div>
            
            {/* Preview Section */}
            <div className="order-1 lg:order-2">
              <h2 className="text-lg font-medium mb-4">Preview</h2>
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <PosterPreview
                  data={posterData}
                  background={selectedBackground}
                  editable
                  className="max-w-2xl mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 