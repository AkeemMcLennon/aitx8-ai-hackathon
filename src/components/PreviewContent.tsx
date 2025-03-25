'use client';

import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PosterPreview from '@/components/PosterPreview';
import { PosterData } from '@/types';
import { Button } from '@/components/ui/button';
import { CSSEditDialog } from '@/components/ui/css-edit-dialog';
import { Wand2 } from 'lucide-react';

interface CSSStyles {
  containerStyles: Record<string, string>;
  backgroundStyles: Record<string, string>;
  glassContainerStyles: Record<string, string>;
  assetStyles: Array<{
    selector: string;
    styles: Record<string, string>;
  }>;
}

const PreviewContent: FC = () => {
  const searchParams = useSearchParams();
  const [posterData, setPosterData] = useState<PosterData>({ assets: [], background: undefined });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customCSS, setCustomCSS] = useState<CSSStyles | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cssHistory, setCssHistory] = useState<Array<CSSStyles | null>>([]);
  
  useEffect(() => {
    const stateParam = searchParams.get('state');
    if (stateParam) {
      try {
        const state = JSON.parse(decodeURIComponent(stateParam));
        setPosterData(state);
      } catch (error) {
        console.error('Failed to parse state:', error);
      }
    }
    setIsLoaded(true);
  }, [searchParams]);

  // Function to generate CSS string from poster data
  const generateCSS = () => {
    const css = [];
    
    // Container styles
    css.push(`.poster-container {
  position: relative;
  aspect-ratio: 3/4;
  width: 100%;
  max-width: 1200px;
  overflow: hidden;
  border-radius: 0.5rem;
}`);

    // Background styles
    if (posterData.background) {
      css.push(`
.poster-background {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-image: url('${posterData.background.url}');
  background-size: cover;
  background-position: center;
}`);
    }

    // Glass containers
    css.push(`
.glass-container {
  position: absolute;
  left: 0;
  right: 0;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}`);

    // Asset styles
    posterData.assets.forEach((asset, index) => {
      if (asset.type === 'text') {
        css.push(`
.asset-text-${index + 1} {
  position: absolute;
  transform: translate(${asset.x}px, ${asset.y}px) rotate(${asset.rotation || 0}deg);
  color: ${asset.color || '#ffffff'};
  ${index === 0 ? 'font-size: min(5vw, 3rem);' : ''}
  ${index === 1 ? 'font-size: min(3vw, 1.5rem);' : ''}
  ${index === 2 ? 'font-size: min(2.5vw, 1.25rem);' : ''}
  ${index === 3 ? 'font-size: min(2vw, 1rem);' : ''}
  white-space: pre-wrap;
  word-break: break-words;
}`);
      } else if (asset.type === 'logo') {
        css.push(`
.asset-logo-${index + 1} {
  position: absolute;
  transform: translate(${asset.x}px, ${asset.y}px) rotate(${asset.rotation || 0}deg);
  width: ${asset.width}px;
  height: ${asset.height}px;
}`);
      }
    });

    return css.join('\n\n');
  };

  const handleCSSModifications = (modifications: { modifications: Array<{ className: string; content: string }> }) => {
    console.log('Applying CSS modifications:', modifications);
    
    // Store current state in history before updating
    setCssHistory(prev => [...prev, customCSS]);
    
    // If customCSS is null, initialize it with the current state
    const baseCSS = customCSS || {
      containerStyles: {
        position: 'relative',
        aspectRatio: '3/4',
        width: '100%',
        maxWidth: '1200px',
        overflow: 'hidden',
        borderRadius: '0.5rem'
      },
      backgroundStyles: posterData.background ? {
        position: 'absolute',
        inset: '0',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        backgroundImage: `url('${posterData.background.url}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {},
      glassContainerStyles: {
        position: 'absolute',
        left: '0',
        right: '0',
        padding: '2rem',
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      },
      assetStyles: posterData.assets.map((asset, index) => ({
        selector: `.asset-text-${index + 1}`,
        styles: {
          color: asset.color || '#ffffff',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-words',
          ...(index === 0 ? { fontSize: 'min(5vw, 3rem)', fontWeight: 'bold', marginBottom: '0.5rem' } : {}),
          ...(index === 1 ? { fontSize: 'min(3vw, 1.5rem)', fontWeight: '500' } : {}),
          ...(index === 2 ? { fontSize: 'min(2.5vw, 1.25rem)', fontWeight: '600', marginBottom: '0.5rem' } : {}),
          ...(index === 3 ? { fontSize: 'min(2vw, 1rem)', lineHeight: '1.75' } : {})
        }
      }))
    };
    
    // Create a deep copy of the current CSS to avoid mutating state directly
    const updatedCSS = JSON.parse(JSON.stringify(baseCSS));
    
    // Process each modification
    modifications.modifications.forEach(mod => {
      // Parse the CSS content into key-value pairs
      const properties = mod.content.split(';')
        .filter(prop => prop.trim())
        .reduce((acc, prop) => {
          const [key, value] = prop.split(':').map(s => s.trim());
          if (key && value) {
            // Convert kebab-case to camelCase for consistency
            const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            acc[camelKey] = value;
          }
          return acc;
        }, {} as Record<string, string>);

      // Map className to the appropriate style object
      if (mod.className === '.container') {
        Object.assign(updatedCSS.containerStyles, properties);
      } else if (mod.className === '.background') {
        Object.assign(updatedCSS.backgroundStyles, properties);
      } else if (mod.className === '.glass-container') {
        Object.assign(updatedCSS.glassContainerStyles, properties);
      } else if (mod.className.startsWith('.asset-text-')) {
        // Handle asset styles
        const assetIndex = parseInt(mod.className.split('-')[2]) - 1;
        if (!isNaN(assetIndex) && assetIndex >= 0 && assetIndex < updatedCSS.assetStyles.length) {
          Object.assign(updatedCSS.assetStyles[assetIndex].styles, properties);
        }
      }
    });

    console.log('Updated CSS:', updatedCSS);
    setCustomCSS(updatedCSS);
  };

  const handleUndo = () => {
    if (cssHistory.length > 0) {
      const previousCSS = cssHistory[cssHistory.length - 1];
      setCustomCSS(previousCSS);
      setCssHistory(prev => prev.slice(0, -1));
    }
  };

  const cssToDisplay = customCSS ? JSON.stringify(customCSS, null, 2) : generateCSS();

  if (!isLoaded) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>;
  }

  return (
    <div className="flex min-h-screen relative">
      {/* Preview Section */}
      <div className="w-1/2 p-4 bg-gray-900">
        <div className="sticky top-4">
          <div className="relative w-full">
            <PosterPreview
              data={posterData}
              background={posterData.background}
              className="w-full"
              customCSS={customCSS || undefined}
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 z-50"
              onClick={() => setIsDialogOpen(true)}
            >
              Edit with AI
            </Button>
          </div>
        </div>
      </div>
      
      {/* CSS Section */}
      <div className="w-1/2 p-4 bg-gray-800">
        <div className="sticky top-4">
          <h2 className="text-xl font-bold mb-4 text-white">CSS Transformations</h2>
          <pre className="bg-gray-900 p-4 rounded-lg overflow-auto text-sm text-white font-mono">
            {cssToDisplay}
          </pre>
        </div>
      </div>

      <CSSEditDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          // Reset the dialog state when closing
          setCssHistory([]);
        }}
        originalCSS={generateCSS()}
        onApplyChanges={handleCSSModifications}
        onUndo={handleUndo}
        canUndo={cssHistory.length > 0}
      />
    </div>
  );
};

export default PreviewContent; 