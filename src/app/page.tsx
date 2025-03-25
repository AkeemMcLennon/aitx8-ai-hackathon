import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      
      <main className="page-container flex flex-col items-center justify-center py-12 md:py-24">
        <div className="max-w-3xl w-full text-center space-y-6 animate-fade-in">
          <div className="mb-12">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-4">
              Create Beautiful Event Posters
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
              Design Stunning Promotional <span className="text-primary">Posters</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Create professional looking posters for your events in minutes, no design skills required.
            </p>
          </div>
          
          <div className="pt-4">
            <Link href="/create">
              <Button 
                className="btn-primary text-base px-8 py-6 h-auto" 
                size="lg"
              >
                Create Your Poster
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="glass-panel p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Easy Editing</h3>
              <p className="text-gray-600 text-sm">
                Simple, intuitive tools to customize your poster exactly how you want it.
              </p>
            </div>
            
            <div className="glass-panel p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Beautiful Templates</h3>
              <p className="text-gray-600 text-sm">
                Choose from a variety of professionally designed backgrounds.
              </p>
            </div>
            
            <div className="glass-panel p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Instant Download</h3>
              <p className="text-gray-600 text-sm">
                Export your poster in high quality for printing or sharing online.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
