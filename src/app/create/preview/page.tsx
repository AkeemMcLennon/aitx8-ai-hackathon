import PreviewContent from '@/components/PreviewContent';
import { Suspense } from 'react';
import { LoadingWithFunFacts } from '@/components/ui/loading-with-fun-facts';

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
        <LoadingWithFunFacts />
      </div>
    }>
      <PreviewContent />
    </Suspense>
  );
} 