'use client';
import { motion } from 'framer-motion';
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-dark-950 border-t border-dark-800">
      <div className="container-custom py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 text-center md:text-left">
            <motion.a
              href="/"
              className="text-2xl font-display font-bold inline-block mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-white">Jadilson</span>
              <span className="text-primary-300">.</span>
            </motion.a>
            <p className="text-dark-400 mb-4 max-w-md mx-auto md:mx-0">
              Engenheiro de Software apaixonado por criar aplicações web bonitas e funcionais.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              {[
                { name: 'Início', href: '/' },
                { name: 'Sobre', href: '/sobre' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-dark-400 hover:text-primary-300 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2">
              {[
                { name: 'Blog', href: '/blog' },
                { name: 'Contato', href: 'https://github.com/jadilson12', external: true },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-dark-400 hover:text-primary-300 transition-colors duration-200"
                    {...(link.external && { target: "_blank", rel: "noopener noreferrer" })}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-dark-800">
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
