'use client';

import { useEffect } from 'react';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  useEffect(() => {
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

  return <>{children}</>;
};

export default ClientLayout;
