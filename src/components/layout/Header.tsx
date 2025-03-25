import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 sm:px-6 border-b border-gray-100 backdrop-blur-sm bg-white/50 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-medium tracking-tight">
          PromoMaker
        </Link>
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-sm text-gray-600 hover:text-black transition-colors">
            Home
          </Link>
          <Link href="/create" className="text-sm text-gray-600 hover:text-black transition-colors">
            Create Poster
          </Link>
        </nav>
        <div className="md:hidden">
          <button className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 