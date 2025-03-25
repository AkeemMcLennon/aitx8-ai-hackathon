import { PosterProvider } from '@/context/PosterContext';

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PosterProvider>{children}</PosterProvider>;
} 