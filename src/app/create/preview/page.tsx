import PreviewContent from '@/components/PreviewContent';
import { Suspense } from 'react';

export default function PreviewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PreviewContent />
    </Suspense>
  );
} 