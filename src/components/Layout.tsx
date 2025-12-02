import React from 'react';


interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-dark-900 dark overflow-x-hidden w-full">
      {children}
    </div>
  );
};

export default Layout;
