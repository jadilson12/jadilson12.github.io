'use client';
import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import React from 'react';

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/jadilson12', icon: FaGithub },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/jadilson12/',
    icon: FaLinkedinIn,
  },
  { name: 'X', href: 'https://x.com/jadilson', icon: FaXTwitter },
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-dark-950 border-t border-dark-800">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <p className="text-dark-400 text-sm">
            © {currentYear} Jadilson Guedes. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map(social => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="text-dark-500 hover:text-primary-300 transition-colors"
              >
                <social.icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
