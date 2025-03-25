import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const EditorContent = dynamic(() => import('@/components/EditorContent'), {
  ssr: false,
});

export default function EditorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditorContent />
    </Suspense>
  );
} 