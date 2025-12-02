'use client';
import { motion } from 'framer-motion';
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-dark-950 border-t border-dark-800">
      <div className="container-custom py-8">
        {/* Bottom Bar */}
        <div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <p className="text-dark-400 text-sm">
              © {currentYear} Jadilson Guedes. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
