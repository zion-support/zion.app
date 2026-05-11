'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleServices = () => setIsServicesOpen(!isServicesOpen);

  return (
    <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-emerald-400">
              Zion Tech Group
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="/"
                className="text-gray-300 hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-300 hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>
              
              {/* Services Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleServices}
                  className="text-gray-300 hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                >
                  Services
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                
                {isServicesOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-slate-800 rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/ai-services"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-emerald-400 hover:bg-slate-700"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      AI Services
                    </Link>
                    <Link
                      href="/blockchain-solutions"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-emerald-400 hover:bg-slate-700"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      Blockchain Solutions
                    </Link>
                    <Link
                      href="/5g-solutions"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-emerald-400 hover:bg-slate-700"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      5G Solutions
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/contact"
                className="text-gray-300 hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-emerald-400 p-2 rounded-md"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800 rounded-md mt-2">
              <Link
                href="/"
                className="text-gray-300 hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-300 hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link
                href="/ai-services"
                className="text-gray-300 hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                AI Services
              </Link>
              <Link
                href="/blockchain-solutions"
                className="text-gray-300 hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                Blockchain Solutions
              </Link>
              <Link
                href="/5g-solutions"
                className="text-gray-300 hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                5G Solutions
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                Contact
              </Link>
              <Link
                href="/contact"
                className="bg-emerald-600 hover:bg-emerald-700 text-white block px-3 py-2 rounded-md text-base font-medium mt-4"
                onClick={toggleMenu}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;