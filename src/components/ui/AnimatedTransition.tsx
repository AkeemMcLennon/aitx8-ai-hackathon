import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTransitionProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
}

const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  show,
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'transition-all duration-300',
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        className
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition; 