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
  textContainerStyles: Array<{
    selector: string;
    styles: Record<string, string>;
  }>;
  assetStyles: Array<{
    selector: string;
    styles: Record<string, string>;
  }>;
}

const getAspectRatioStyles = (aspectRatio: string = '4:5') => {
  const [width, height] = aspectRatio.split(':').map(Number);
  const isLandscape = width > height;
  const isSquare = width === height;
  
  // Calculate padding and font size multipliers based on aspect ratio
  const paddingMultiplier = isLandscape ? 0.05 : isSquare ? 0.06 : 0.08;
  
  return {
    containerAspectRatio: `${width}/${height}`,
    padding: `${paddingMultiplier * 100}%`,
    isLandscape,
    isSquare
  };
};

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
    const aspectStyles = getAspectRatioStyles(posterData.aspectRatio);
    
    // Container styles
    css.push(`.poster-container {
  position: relative;
  aspect-ratio: ${aspectStyles.containerAspectRatio};
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

    // Text containers with responsive layout
    css.push(`
.text-containers {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: ${aspectStyles.isLandscape ? 'row' : 'column'};
  ${!aspectStyles.isLandscape ? 'justify-content: space-between;' : ''}
}`);

    // Glass containers
    [1, 2].forEach(index => {
      css.push(`
.text-container-${index} {
  position: relative;
  ${aspectStyles.isLandscape ? 'width: 50%;' : 'width: 100%;'}
  padding: ${aspectStyles.padding};
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}`);
    });

    // Asset styles with responsive font sizes
    posterData.assets.forEach((asset, index) => {
      if (asset.type === 'text') {
        const fontSize = index === 0 
          ? 'min(5vw, 3rem)'
          : index === 1 
          ? 'min(3vw, 1.5rem)'
          : index === 2 
          ? 'min(2.5vw, 1.25rem)'
          : 'min(2vw, 1rem)';

        css.push(`
.asset-text-${index + 1} {
  position: relative;
  transform: translate(${asset.x}px, ${asset.y}px) rotate(${asset.rotation || 0}deg);
  color: ${asset.color || '#ffffff'};
  font-size: ${fontSize};
  ${index === 0 ? 'font-weight: bold;' : ''}
  ${index === 1 ? 'font-weight: 500;' : ''}
  ${index === 2 ? 'font-weight: 600;' : ''}
  ${index === 3 ? 'line-height: 1.75;' : ''}
  white-space: pre-wrap;
  word-break: break-words;
  margin-bottom: ${index < 3 ? '0.5rem' : '0'};
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
      textContainerStyles: [1, 2].map(index => ({
        selector: `.text-container-${index}`,
        styles: {
          position: 'absolute',
          left: '0',
          right: '0',
          padding: '2rem',
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }
      })),
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
      } else if (mod.className.startsWith('.text-container-')) {
        const containerIndex = parseInt(mod.className.split('-')[2]) - 1;
        if (!isNaN(containerIndex) && containerIndex >= 0 && containerIndex < updatedCSS.textContainerStyles.length) {
          Object.assign(updatedCSS.textContainerStyles[containerIndex].styles, properties);
        }
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