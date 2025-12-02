import React from 'react';


interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className={`min-h-screen bg-dark-900 dark overflow-x-hidden w-full ${className || ''}`}>
      {children}
    </div>
  );
};

export default Layout;
