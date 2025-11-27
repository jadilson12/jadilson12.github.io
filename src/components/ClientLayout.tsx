'use client';

import { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if splash screen has been shown before
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    }

    // Captura erros relacionados ao window.ethereum (navegadores mobile com Web3)
    const handleError = (event: ErrorEvent) => {
      if (
        event.message?.includes('ethereum') ||
        event.message?.includes('selectedAddress')
      ) {
        event.preventDefault();
        return true;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.message || String(event.reason);
      if (reason.includes('ethereum') || reason.includes('selectedAddress')) {
        event.preventDefault();
        return true;
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('hasSeenSplash', 'true');
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && isClient && <SplashScreen onComplete={handleSplashComplete} />}
      {children}
    </>
  );
};

export default ClientLayout;
