'use client';

import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <div className="relative isolate min-h-screen">
      {children}
    </div>
  );
};

export default PageTransition;
