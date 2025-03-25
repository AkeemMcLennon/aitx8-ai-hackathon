'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { usePoster } from './PosterContext';
import PosterPreview from '@/components/PosterPreview';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from './ui/use-toast';
import { PosterAsset } from '@/types';
import { BackButton } from '@/components/ui/back-button';
import { LogoUploader } from './ui/logo-uploader';

export default function EditorContent() {
  const router = useRouter();
  const { poster, addAsset, updateAsset, removeAsset } = usePoster();
  
  const [newAsset, setNewAsset] = useState({
    type: 'text' as const,
    content: '',
    color: '#000000',
    x: 50,
    y: 50,
    width: 200,
    height: 50,
    rotation: 0,
  });

  const handleAddAsset = () => {
    if (!newAsset.content) {
      toast({
        title: 'Error',
        description: 'Please enter some text content',
        variant: 'destructive',
      });
      return;
    }

    addAsset(newAsset);
    setNewAsset({
      ...newAsset,
      content: '',
    });
  };

  const handleLogoUpload = async (file: File) => {
    try {
      const url = URL.createObjectURL(file);
      const img = new Image();
      
      img.onload = () => {
        // Calculate dimensions while maintaining aspect ratio
        const maxWidth = 200;
        const maxHeight = 200;
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (maxHeight / height) * width;
          height = maxHeight;
        }

        addAsset({
          type: 'logo',
          content: file.name,
          url,
          file,
          x: 50,
          y: 50,
          width,
          height,
          rotation: 0,
        });

        toast({
          title: 'Success',
          description: 'Logo uploaded successfully',
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        toast({
          title: 'Error',
          description: 'Failed to load the image',
          variant: 'destructive',
        });
      };

      img.src = url;
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to upload the logo',
        variant: 'destructive',
      });
    }
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

  if (!poster.background) {
    router.push('/create/background');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="page-container py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <BackButton href="/create/background" />
            <div>
              <h1 className="text-3xl font-bold tracking-tighter mb-2">
                Customize Your Poster
              </h1>
              <p className="text-gray-600">
                Add text and shapes to make your poster unique.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
            {/* Controls Section */}
            <div className="order-2 lg:order-1">
              <div className="sticky top-24 space-y-6">
                {/* Logo Upload Section */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-medium mb-4">Upload Logo</h2>
                  <LogoUploader onLogoUpload={handleLogoUpload} />
                </div>

                {/* Text Controls Section */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-medium mb-4">Add Text</h2>
                  
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
                
                {/* Existing Elements Section */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-medium mb-4">Existing Elements</h2>
                  <div className="space-y-4">
                    {poster.assets.map((asset: PosterAsset) => (
                      <div key={asset.id} className="flex items-center gap-4">
                        {asset.type === 'text' ? (
                          <Input
                            value={asset.content}
                            onChange={(e) => handleAssetChange(asset.id, { content: e.target.value })}
                          />
                        ) : (
                          <div className="flex-1 truncate text-sm">
                            {asset.content}
                          </div>
                        )}
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
                  data={poster}
                  background={poster.background}
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