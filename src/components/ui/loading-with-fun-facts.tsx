'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const funFacts = [
  {
    fact: "The first event posters date back to ancient Egypt, where they were used to announce public events and festivals.",
    category: "History"
  },
  {
    fact: "Color psychology shows that red and yellow are the most attention-grabbing colors for event posters.",
    category: "Design"
  },
  {
    fact: "The most effective event posters follow the '5-second rule' - viewers should understand the key information at a glance.",
    category: "Tips"
  },
  {
    fact: "Typography experts recommend using no more than 2-3 different fonts in a poster for optimal readability.",
    category: "Typography"
  },
  {
    fact: "The 'Z-pattern' layout is a proven way to guide viewers' eyes through your poster content.",
    category: "Layout"
  },
  {
    fact: "Adding social proof (like 'Join 1000+ attendees') can increase event registration by up to 34%.",
    category: "Marketing"
  }
];

interface LoadingWithFunFactsProps {
  className?: string;
}

export function LoadingWithFunFacts({ className = '' }: LoadingWithFunFactsProps) {
  const [currentFactIndex, setCurrentFactIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % funFacts.length);
    }, 5000); // Change fact every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="mb-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
      
      <div className="w-full max-w-lg mx-auto px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFactIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              duration: 0.4,
              ease: "easeOut"
            }}
            className="flex flex-col items-center text-center min-h-[120px]"
          >
            <motion.p 
              className="text-lg font-medium text-gray-900 mb-3 leading-relaxed"
              layout
            >
              {funFacts[currentFactIndex].fact}
            </motion.p>
            <motion.span 
              className="text-sm font-medium text-primary/80 px-3 py-1 bg-primary/5 rounded-full"
              layout
            >
              {funFacts[currentFactIndex].category}
            </motion.span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 