'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 md:mb-8">
      <div className="flex items-center gap-2 text-xs md:text-sm overflow-x-auto pb-2 scrollbar-hide">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <span className="text-dark-500 flex-shrink-0 select-none" aria-hidden="true">
                  ›
                </span>
              )}

              <div className="flex-shrink-0 min-w-0">
                {isLast || !item.href ? (
                  <span className="text-dark-400 font-medium truncate max-w-[250px] sm:max-w-md md:max-w-none block">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href}>
                    <motion.span
                      className="text-dark-300 hover:text-primary-300 transition-colors duration-200 whitespace-nowrap block"
                      whileHover={{ x: 2 }}
                    >
                      {item.label}
                    </motion.span>
                  </Link>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};

export default Breadcrumb;
