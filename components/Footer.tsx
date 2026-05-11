/* Legacy marketing footer (not used in main App Router layout).
 * Kept for compatibility but now reuses shared contact + social constants.
 */
'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Linkedin, Twitter, Github } from 'lucide-react';
import { CONTACT_INFO, SOCIAL_LINKS } from '../app/utils/seoConstants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-emerald-400">Zion Tech Group</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Leading provider of AI, blockchain, and 5G solutions for modern businesses.
              We help companies transform their operations with cutting-edge technology.
            </p>
            <div className="flex space-x-4">
              <a
                href={SOCIAL_LINKS.linkedin}
                className="text-gray-400 hover:text-emerald-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.twitter}
                className="text-gray-400 hover:text-emerald-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.github}
                className="text-gray-400 hover:text-emerald-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/ai-services"
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors"
                >
                  AI Services
                </Link>
              </li>
              <li>
                <Link
                  href="/blockchain-solutions"
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors"
                >
                  Blockchain Solutions
                </Link>
              </li>
              <li>
                <Link
                  href="/5g-solutions"
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors"
                >
                  5G Solutions
                </Link>
              </li>
              <li>
                <Link
                  href="/api-development"
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors"
                >
                  API Development
                </Link>
              </li>
              <li>
                <Link
                  href="/analytics"
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors"
                >
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors"
                >
                  Press
                </Link>
              </li>
              <li>
                <Link
                  href="/partners"
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors"
                >
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors"
                >
                  {CONTACT_INFO.email}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/\D/g, '')}`}
                  className="text-gray-300 hover:text-emerald-400 text-sm transition-colors"
                >
                  {CONTACT_INFO.phone}
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  {CONTACT_INFO.address.street}
                  <br />
                  {CONTACT_INFO.address.city}, {CONTACT_INFO.address.state} {CONTACT_INFO.address.zipCode}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Zion Tech Group. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-emerald-400 text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-emerald-400 text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-gray-400 hover:text-emerald-400 text-sm transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;