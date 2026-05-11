'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Menu, Search, Sparkles, X } from 'lucide-react';
import {
  AI_SERVICE_LINKS,
  AUTOMATION_LINKS,
  FEATURED_AI_SERVICE_LINKS,
  FEATURED_PRODUCT_LINKS,
  PRIMARY_NAV_LINKS,
  PRODUCT_LINKS,
  RESOURCE_LINKS,
  SOLUTION_LINKS,
  type NavigationLink,
} from '../constants/navigation';

interface NavigationProps {
  className?: string;
  children?: React.ReactNode;
}

type NavLink = {
  name: string;
  href: string;
};

type QuickAccessLink = NavLink & {
  group: string;
};

const legacyResourceLinks: NavLink[] = [
  { name: 'Services', href: '/services' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Blog', href: '/blog' },
  { name: 'Case Studies', href: '/case-studies' },
];

const linkBaseClass =
  'rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900';

const activeLinkClass = 'bg-purple-500/25 text-white shadow-lg';
const inactiveLinkClass = 'text-gray-300 hover:bg-purple-500/20 hover:text-white';
const aiDesktopMenuId = 'ai-services-menu';
const aiMobileMenuId = 'ai-services-mobile-menu';
const solutionsDesktopMenuId = 'solutions-menu';
const solutionsMobileMenuId = 'solutions-mobile-menu';
const productsDesktopMenuId = 'products-menu';
const productsMobileMenuId = 'products-mobile-menu';
const resourcesDesktopMenuId = 'resources-menu';
const resourcesMobileMenuId = 'resources-mobile-menu';
const mobileNavigationPanelId = 'mobile-navigation-panel';

const quickFindButtonClassName =
  'inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-900/70 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-purple-400/60 hover:text-white';
const quickFindHintClassName =
  'inline-flex items-center rounded-md border border-slate-600 bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300';

function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function isActiveNavigationLink(pathname: string, link: NavigationLink): boolean {
  if (isActivePath(pathname, link.href)) {
    return true;
  }

  return link.aliases?.some((alias) => isActivePath(pathname, alias)) ?? false;
}

export default function Navigation({ className, children }: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const currentPath = pathname ?? '/';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [activeCommandIndex, setActiveCommandIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);

  const aiRouteActive = AI_SERVICE_LINKS.some((service) =>
    isActiveNavigationLink(currentPath, service),
  );

  const solutionRouteActive = SOLUTION_LINKS.some((link) =>
    isActiveNavigationLink(currentPath, link),
  );

  const productRouteActive = PRODUCT_LINKS.some((link) =>
    isActiveNavigationLink(currentPath, link),
  );

  const resourceRouteActive = RESOURCE_LINKS.some((link) =>
    isActiveNavigationLink(currentPath, link),
  );

  const quickAccessLinks = useMemo(() => {
    const links: QuickAccessLink[] = [
      ...PRIMARY_NAV_LINKS.map((link) => ({ ...link, group: 'Navigation' })),
      ...SOLUTION_LINKS.map((link) => ({ ...link, group: 'Solutions' })),
      ...RESOURCE_LINKS.map((link) => ({ ...link, group: 'Company' })),
      ...legacyResourceLinks.map((link) => ({ ...link, group: 'Resources' })),
      ...AUTOMATION_LINKS.map((link) => ({ ...link, group: 'Automation' })),
      ...AI_SERVICE_LINKS.map((link) => ({ ...link, group: 'AI Services' })),
      ...PRODUCT_LINKS.map((link) => ({ ...link, group: 'Products' })),
    ];

    const uniqueLinks = new Map<string, QuickAccessLink>();
    links.forEach((link) => {
      if (!uniqueLinks.has(link.href)) {
        uniqueLinks.set(link.href, link);
      }
    });

    return Array.from(uniqueLinks.values());
  }, []);

  const filteredQuickAccessLinks = useMemo(() => {
    const normalizedQuery = commandQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return quickAccessLinks.slice(0, 20);
    }

    return quickAccessLinks
      .filter((link) =>
        `${link.name} ${link.group} ${link.href}`.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 24);
  }, [commandQuery, quickAccessLinks]);

  const getNavLinkClassName = useCallback(
    (isActive: boolean) => `${linkBaseClass} ${isActive ? activeLinkClass : inactiveLinkClass}`,
    []
  );

  const closeCommandMenu = useCallback(() => {
    setIsCommandMenuOpen(false);
    setCommandQuery('');
    setActiveCommandIndex(0);
  }, []);

  const openCommandMenu = useCallback(() => {
    setIsCommandMenuOpen(true);
  }, []);

  const handleCommandSelect = useCallback(
    (href: string) => {
      router.push(href);
      closeCommandMenu();
      setActiveDropdown(null);
      setIsMobileMenuOpen(false);
    },
    [closeCommandMenu, router]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
        closeCommandMenu();
      }
    };

    const handleCommandShortcut = (event: KeyboardEvent) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (!isShortcut) {
        return;
      }

      event.preventDefault();
      setActiveDropdown(null);
      setIsMobileMenuOpen(false);
      openCommandMenu();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleCommandShortcut);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleCommandShortcut);
    };
  }, [closeCommandMenu, openCommandMenu]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen || isCommandMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, isCommandMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen || !navRef.current) {
      return;
    }

    const mobileMenu = navRef.current.querySelector<HTMLElement>(`#${mobileNavigationPanelId}`);
    if (!mobileMenu) {
      return;
    }

    const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusableElements = () =>
      Array.from(mobileMenu.querySelectorAll<HTMLElement>(focusableSelector));

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusableElements = getFocusableElements();
    focusableElements[0]?.focus();

    const handleFocusTrap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return;
      }

      const currentFocusable = getFocusableElements();
      if (currentFocusable.length === 0) {
        return;
      }

      const firstElement = currentFocusable[0];
      const lastElement = currentFocusable[currentFocusable.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleFocusTrap);
    return () => {
      document.removeEventListener('keydown', handleFocusTrap);
      previouslyFocused?.focus();
    };
  }, [activeDropdown, isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    closeCommandMenu();
  }, [closeCommandMenu, currentPath]);

  useEffect(() => {
    if (!isCommandMenuOpen) {
      return;
    }

    window.requestAnimationFrame(() => {
      commandInputRef.current?.focus();
    });
  }, [isCommandMenuOpen]);

  useEffect(() => {
    if (activeCommandIndex <= filteredQuickAccessLinks.length - 1) {
      return;
    }

    setActiveCommandIndex(0);
  }, [activeCommandIndex, filteredQuickAccessLinks.length]);

  useEffect(() => {
    setActiveCommandIndex(0);
  }, [commandQuery]);

  const handleCommandInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveCommandIndex((current) =>
          Math.min(current + 1, Math.max(filteredQuickAccessLinks.length - 1, 0))
        );
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveCommandIndex((current) => Math.max(current - 1, 0));
      }

      if (event.key === 'Enter') {
        const selectedLink = filteredQuickAccessLinks[activeCommandIndex];
        if (!selectedLink) {
          return;
        }

        event.preventDefault();
        handleCommandSelect(selectedLink.href);
      }
    },
    [activeCommandIndex, filteredQuickAccessLinks, handleCommandSelect]
  );

  const toggleDropdown = useCallback((dropdown: string) => {
    setIsCommandMenuOpen(false);
    setActiveDropdown((current) => (current === dropdown ? null : dropdown));
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsCommandMenuOpen(false);
    setIsMobileMenuOpen((current) => !current);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    closeCommandMenu();
  }, [closeCommandMenu]);

  const toggleCommandMenu = useCallback(() => {
    setActiveDropdown(null);
    setIsCommandMenuOpen((current) => !current);
  }, []);

  const openQuickFindFromMobile = useCallback(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    openCommandMenu();
  }, [openCommandMenu]);

  const handleDesktopAiTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setActiveDropdown('ai');
      }

      if (event.key === 'Escape') {
        setActiveDropdown(null);
      }
    },
    []
  );

  const handleMobileAiTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setActiveDropdown('ai-mobile');
      }

      if (event.key === 'Escape') {
        setActiveDropdown(null);
      }
    },
    []
  );

  const handleDesktopProductsTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setActiveDropdown('products');
      }

      if (event.key === 'Escape') {
        setActiveDropdown(null);
      }
    },
    []
  );

  const handleMobileProductsTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setActiveDropdown('products-mobile');
      }

      if (event.key === 'Escape') {
        setActiveDropdown(null);
      }
    },
    []
  );

  const handleDesktopResourcesTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setActiveDropdown('resources');
      }

      if (event.key === 'Escape') {
        setActiveDropdown(null);
      }
    },
    []
  );

  const handleMobileResourcesTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setActiveDropdown('resources-mobile');
      }

      if (event.key === 'Escape') {
        setActiveDropdown(null);
      }
    },
    []
  );

  return (
    <nav
      ref={navRef}
      id="site-navigation"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-purple-500/25 bg-slate-900/95 shadow-lg shadow-purple-500/10 backdrop-blur-xl'
          : 'border-b border-purple-500/10 bg-slate-900/80 backdrop-blur-lg'
      } ${className || ''}`}
      aria-label="Primary site navigation"
      tabIndex={-1}
    >
      {children || (
        <>
          <div
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/70 to-transparent"
            aria-hidden="true"
          />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center">
                <a
                  href="/"
                  className="group flex items-center space-x-3 transition-transform hover:scale-105"
                  aria-label="Go to Zion Tech Group homepage"
                  onClick={closeMobileMenu}
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 opacity-75 blur-sm transition-opacity group-hover:opacity-100" />
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-xl font-bold text-transparent">
                      Zion Tech Group
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-purple-200/70">
                      AI Delivery Studio
                    </span>
                  </div>
                </a>
              </div>

              <div className="hidden items-center gap-1.5 md:flex">
                <a
                  href="/"
                  className={getNavLinkClassName(isActivePath(currentPath, '/'))}
                  aria-current={isActivePath(currentPath, '/') ? 'page' : undefined}
                >
                  Home
                </a>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('solutions')}
                    className={`${linkBaseClass} ${
                      activeDropdown === 'solutions' || solutionRouteActive
                        ? activeLinkClass
                        : inactiveLinkClass
                    } flex items-center`}
                    aria-expanded={activeDropdown === 'solutions'}
                    aria-haspopup="menu"
                    aria-controls={solutionsDesktopMenuId}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveDropdown('solutions');
                      }
                      if (e.key === 'Escape') setActiveDropdown(null);
                    }}
                  >
                    Solutions
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                        activeDropdown === 'solutions' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {activeDropdown === 'solutions' && (
                    <div
                      id={solutionsDesktopMenuId}
                      role="menu"
                      aria-label="Industry solutions"
                      className="absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-purple-500/30 bg-slate-800/95 shadow-2xl backdrop-blur-xl"
                    >
                      <div className="border-b border-slate-700/70 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-purple-200">
                          Industry Solutions
                        </p>
                      </div>
                      <div className="py-2">
                        {SOLUTION_LINKS.map((link) => {
                          const isLinkActive = isActiveNavigationLink(currentPath, link);
                          return (
                            <a
                              key={link.href}
                              href={link.href}
                              role="menuitem"
                              aria-current={isLinkActive ? 'page' : undefined}
                              className={`block px-4 py-2.5 text-sm transition-all duration-150 ${
                                isLinkActive
                                  ? 'bg-purple-500/20 text-white'
                                  : 'text-gray-300 hover:bg-purple-500/20 hover:text-white'
                              }`}
                              onClick={() => setActiveDropdown(null)}
                            >
                              {link.name}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <a
                  href="/services"
                  className={getNavLinkClassName(isActivePath(currentPath, '/services'))}
                  aria-current={isActivePath(currentPath, '/services') ? 'page' : undefined}
                >
                  Services
                </a>
                <a
                  href="/pricing"
                  className={getNavLinkClassName(isActivePath(currentPath, '/pricing'))}
                  aria-current={isActivePath(currentPath, '/pricing') ? 'page' : undefined}
                >
                  Pricing
                </a>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('ai')}
                    className={`${linkBaseClass} ${
                      activeDropdown === 'ai' || aiRouteActive ? activeLinkClass : inactiveLinkClass
                    } flex items-center`}
                    aria-expanded={activeDropdown === 'ai'}
                    aria-haspopup="menu"
                    aria-controls={aiDesktopMenuId}
                    onKeyDown={handleDesktopAiTriggerKeyDown}
                  >
                    AI Services
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                        activeDropdown === 'ai' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {activeDropdown === 'ai' && (
                    <div
                      id={aiDesktopMenuId}
                      role="menu"
                      aria-label="Featured AI services"
                      className="absolute left-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-purple-500/30 bg-slate-800/95 shadow-2xl backdrop-blur-xl"
                    >
                      <div className="border-b border-slate-700/70 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-purple-200">
                          Featured AI Services
                        </p>
                      </div>
                      <div className="py-2">
                        {FEATURED_AI_SERVICE_LINKS.map((service) => {
                          const isLinkActive = isActiveNavigationLink(currentPath, service);
                          return (
                            <a
                              key={service.href}
                              href={service.href}
                              role="menuitem"
                              aria-current={isLinkActive ? 'page' : undefined}
                              className={`block px-4 py-2.5 text-sm transition-all duration-150 ${
                                isLinkActive
                                  ? 'bg-purple-500/20 text-white'
                                  : 'text-gray-300 hover:bg-purple-500/20 hover:text-white'
                              }`}
                              onClick={() => setActiveDropdown(null)}
                            >
                              {service.name}
                            </a>
                          );
                        })}
                        <a
                          href="/ai-services"
                          role="menuitem"
                          className="block border-t border-slate-700/70 px-4 py-3 text-sm font-medium text-purple-300 hover:bg-purple-500/20 hover:text-white"
                          onClick={() => setActiveDropdown(null)}
                        >
                          Browse all AI services →
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('products')}
                    className={`${linkBaseClass} ${
                      activeDropdown === 'products' || productRouteActive
                        ? activeLinkClass
                        : inactiveLinkClass
                    } flex items-center`}
                    aria-expanded={activeDropdown === 'products'}
                    aria-haspopup="menu"
                    aria-controls={productsDesktopMenuId}
                    onKeyDown={handleDesktopProductsTriggerKeyDown}
                  >
                    Products
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                        activeDropdown === 'products' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {activeDropdown === 'products' && (
                    <div
                      id={productsDesktopMenuId}
                      role="menu"
                      aria-label="Products"
                      className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-purple-500/30 bg-slate-800/95 shadow-2xl backdrop-blur-xl"
                    >
                      <div className="border-b border-slate-700/70 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-purple-200">
                          Featured Products
                        </p>
                      </div>
                      <div className="py-2">
                        {FEATURED_PRODUCT_LINKS.map((product) => {
                          const isLinkActive = isActiveNavigationLink(currentPath, product);
                          return (
                            <a
                              key={product.href}
                              href={product.href}
                              role="menuitem"
                              aria-current={isLinkActive ? 'page' : undefined}
                              className={`block px-4 py-2.5 text-sm transition-all duration-150 ${
                                isLinkActive
                                  ? 'bg-purple-500/20 text-white'
                                  : 'text-gray-300 hover:bg-purple-500/20 hover:text-white'
                              }`}
                              onClick={() => setActiveDropdown(null)}
                            >
                              {product.name}
                            </a>
                          );
                        })}
                        <a
                          href="/products"
                          role="menuitem"
                          className="block border-t border-slate-700/70 px-4 py-3 text-sm font-medium text-purple-300 hover:bg-purple-500/20 hover:text-white"
                          onClick={() => setActiveDropdown(null)}
                        >
                          Browse all products →
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('resources')}
                    className={`${linkBaseClass} ${
                      activeDropdown === 'resources' || resourceRouteActive
                        ? activeLinkClass
                        : inactiveLinkClass
                    } flex items-center`}
                    aria-expanded={activeDropdown === 'resources'}
                    aria-haspopup="menu"
                    aria-controls={resourcesDesktopMenuId}
                    onKeyDown={handleDesktopResourcesTriggerKeyDown}
                  >
                    Company
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                        activeDropdown === 'resources' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {activeDropdown === 'resources' && (
                    <div
                      id={resourcesDesktopMenuId}
                      role="menu"
                      aria-label="Company and resources"
                      className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-purple-500/30 bg-slate-800/95 shadow-2xl backdrop-blur-xl"
                    >
                      <div className="border-b border-slate-700/70 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-purple-200">
                          Company & Resources
                        </p>
                      </div>
                      <div className="py-2">
                        {RESOURCE_LINKS.map((link) => {
                          const isLinkActive = isActiveNavigationLink(currentPath, link);
                          return (
                            <a
                              key={link.href}
                              href={link.href}
                              role="menuitem"
                              aria-current={isLinkActive ? 'page' : undefined}
                              className={`block px-4 py-2.5 text-sm transition-all duration-150 ${
                                isLinkActive
                                  ? 'bg-purple-500/20 text-white'
                                  : 'text-gray-300 hover:bg-purple-500/20 hover:text-white'
                              }`}
                              onClick={() => setActiveDropdown(null)}
                            >
                              {link.name}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={toggleCommandMenu}
                  className={quickFindButtonClassName}
                  aria-label="Open quick navigation search"
                >
                  <Search className="h-4 w-4" />
                  <span>Quick Find</span>
                  <span className={quickFindHintClassName}>Ctrl/⌘ K</span>
                </button>

                <a
                  href="/contact"
                  className={getNavLinkClassName(isActivePath(currentPath, '/contact'))}
                  aria-current={isActivePath(currentPath, '/contact') ? 'page' : undefined}
                >
                  Contact
                </a>

                <a
                  href="/contact?topic=project&source=nav-desktop"
                  data-cta-event="cta_primary"
                  data-cta-label="nav_desktop"
                  className="ml-2 inline-flex items-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:from-purple-500 hover:to-pink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                  aria-current={isActivePath(currentPath, '/contact') ? 'page' : undefined}
                >
                  Start a Project
                </a>
              </div>

              <div className="flex items-center md:hidden">
                <button
                  type="button"
                  onClick={toggleMobileMenu}
                  className="rounded-lg p-2 text-gray-300 transition-all hover:bg-purple-500/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  aria-label={isMobileMenuOpen ? 'Close main menu' : 'Open main menu'}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls={mobileNavigationPanelId}
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>

            {isMobileMenuOpen && (
              <div
                id={mobileNavigationPanelId}
                className="md:hidden animate-fade-in border-t border-purple-500/20"
              >
                <div className="max-h-[calc(100vh-5rem)] space-y-1 overflow-y-auto px-2 pb-4 pt-4">
                  <a
                    href="/"
                    className={`${getNavLinkClassName(isActivePath(currentPath, '/'))} block px-4 py-3 text-base`}
                    aria-current={isActivePath(currentPath, '/') ? 'page' : undefined}
                    onClick={closeMobileMenu}
                  >
                    Home
                  </a>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleDropdown('solutions-mobile')}
                      className={`${linkBaseClass} ${
                        activeDropdown === 'solutions-mobile' || solutionRouteActive
                          ? activeLinkClass
                          : inactiveLinkClass
                      } flex w-full items-center justify-between px-4 py-3 text-base`}
                      aria-expanded={activeDropdown === 'solutions-mobile'}
                      aria-haspopup="menu"
                      aria-controls={solutionsMobileMenuId}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveDropdown('solutions-mobile');
                        }
                        if (e.key === 'Escape') setActiveDropdown(null);
                      }}
                    >
                      <span>Solutions</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          activeDropdown === 'solutions-mobile' ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {activeDropdown === 'solutions-mobile' && (
                      <div
                        id={solutionsMobileMenuId}
                        className="mt-1 space-y-1 border-l-2 border-purple-500/30 pl-4"
                      >
                        {SOLUTION_LINKS.map((link) => {
                          const isLinkActive = isActiveNavigationLink(currentPath, link);
                          return (
                            <a
                              key={link.href}
                              href={link.href}
                              aria-current={isLinkActive ? 'page' : undefined}
                              className={`block rounded-lg px-4 py-2.5 text-sm transition-all ${
                                isLinkActive
                                  ? 'bg-purple-500/20 text-white'
                                  : 'text-gray-400 hover:bg-purple-500/20 hover:text-white'
                              }`}
                              onClick={closeMobileMenu}
                            >
                              {link.name}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <a
                    href="/services"
                    className={`${getNavLinkClassName(isActivePath(currentPath, '/services'))} block px-4 py-3 text-base`}
                    aria-current={isActivePath(currentPath, '/services') ? 'page' : undefined}
                    onClick={closeMobileMenu}
                  >
                    Services
                  </a>
                  <a
                    href="/pricing"
                    className={`${getNavLinkClassName(isActivePath(currentPath, '/pricing'))} block px-4 py-3 text-base`}
                    aria-current={isActivePath(currentPath, '/pricing') ? 'page' : undefined}
                    onClick={closeMobileMenu}
                  >
                    Pricing
                  </a>
                  <a
                    href="/contact"
                    className={`${getNavLinkClassName(isActivePath(currentPath, '/contact'))} block px-4 py-3 text-base`}
                    aria-current={isActivePath(currentPath, '/contact') ? 'page' : undefined}
                    onClick={closeMobileMenu}
                  >
                    Contact
                  </a>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleDropdown('ai-mobile')}
                      className={`${linkBaseClass} ${
                        activeDropdown === 'ai-mobile' || aiRouteActive
                          ? activeLinkClass
                          : inactiveLinkClass
                      } flex w-full items-center justify-between px-4 py-3 text-base`}
                      aria-expanded={activeDropdown === 'ai-mobile'}
                      aria-haspopup="menu"
                      aria-controls={aiMobileMenuId}
                      onKeyDown={handleMobileAiTriggerKeyDown}
                    >
                      <span>AI Services</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          activeDropdown === 'ai-mobile' ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {activeDropdown === 'ai-mobile' && (
                      <div
                        id={aiMobileMenuId}
                        className="mt-1 space-y-1 border-l-2 border-purple-500/30 pl-4"
                      >
                        {FEATURED_AI_SERVICE_LINKS.map((service) => {
                          const isLinkActive = isActiveNavigationLink(currentPath, service);
                          return (
                            <a
                              key={service.href}
                              href={service.href}
                              aria-current={isLinkActive ? 'page' : undefined}
                              className={`block rounded-lg px-4 py-2.5 text-sm transition-all ${
                                isLinkActive
                                  ? 'bg-purple-500/20 text-white'
                                  : 'text-gray-400 hover:bg-purple-500/20 hover:text-white'
                              }`}
                              onClick={closeMobileMenu}
                            >
                              {service.name}
                            </a>
                          );
                        })}
                        <a
                          href="/ai-services"
                          className="mt-2 block rounded-lg border-t border-purple-500/20 px-4 py-2.5 text-sm font-medium text-purple-300 hover:bg-purple-500/20 hover:text-white"
                          onClick={closeMobileMenu}
                        >
                          Browse all AI services →
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleDropdown('products-mobile')}
                      className={`${linkBaseClass} ${
                        activeDropdown === 'products-mobile' || productRouteActive
                          ? activeLinkClass
                          : inactiveLinkClass
                      } flex w-full items-center justify-between px-4 py-3 text-base`}
                      aria-expanded={activeDropdown === 'products-mobile'}
                      aria-haspopup="menu"
                      aria-controls={productsMobileMenuId}
                      onKeyDown={handleMobileProductsTriggerKeyDown}
                    >
                      <span>Products</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          activeDropdown === 'products-mobile' ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {activeDropdown === 'products-mobile' && (
                      <div
                        id={productsMobileMenuId}
                        className="mt-1 space-y-1 border-l-2 border-purple-500/30 pl-4"
                      >
                        {FEATURED_PRODUCT_LINKS.map((product) => {
                          const isLinkActive = isActiveNavigationLink(currentPath, product);
                          return (
                            <a
                              key={product.href}
                              href={product.href}
                              aria-current={isLinkActive ? 'page' : undefined}
                              className={`block rounded-lg px-4 py-2.5 text-sm transition-all ${
                                isLinkActive
                                  ? 'bg-purple-500/20 text-white'
                                  : 'text-gray-400 hover:bg-purple-500/20 hover:text-white'
                              }`}
                              onClick={closeMobileMenu}
                            >
                              {product.name}
                            </a>
                          );
                        })}
                        <a
                          href="/products"
                          className="mt-2 block rounded-lg border-t border-purple-500/20 px-4 py-2.5 text-sm font-medium text-purple-300 hover:bg-purple-500/20 hover:text-white"
                          onClick={closeMobileMenu}
                        >
                          Browse all products →
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleDropdown('resources-mobile')}
                      className={`${linkBaseClass} ${
                        activeDropdown === 'resources-mobile' || resourceRouteActive
                          ? activeLinkClass
                          : inactiveLinkClass
                      } flex w-full items-center justify-between px-4 py-3 text-base`}
                      aria-expanded={activeDropdown === 'resources-mobile'}
                      aria-haspopup="menu"
                      aria-controls={resourcesMobileMenuId}
                      onKeyDown={handleMobileResourcesTriggerKeyDown}
                    >
                      <span>Company</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          activeDropdown === 'resources-mobile' ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {activeDropdown === 'resources-mobile' && (
                      <div
                        id={resourcesMobileMenuId}
                        className="mt-1 space-y-1 border-l-2 border-purple-500/30 pl-4"
                      >
                        {RESOURCE_LINKS.map((link) => {
                          const isLinkActive = isActiveNavigationLink(currentPath, link);
                          return (
                            <a
                              key={link.href}
                              href={link.href}
                              aria-current={isLinkActive ? 'page' : undefined}
                              className={`block rounded-lg px-4 py-2.5 text-sm transition-all ${
                                isLinkActive
                                  ? 'bg-purple-500/20 text-white'
                                  : 'text-gray-400 hover:bg-purple-500/20 hover:text-white'
                              }`}
                              onClick={closeMobileMenu}
                            >
                              {link.name}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <a
                    href="/contact?topic=project&source=nav-mobile"
                    data-cta-event="cta_primary"
                    data-cta-label="nav_mobile"
                    className="mt-3 block rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-center text-base font-semibold text-white transition hover:from-purple-500 hover:to-pink-500"
                    aria-current={isActivePath(currentPath, '/contact') ? 'page' : undefined}
                    onClick={closeMobileMenu}
                  >
                    Start a Project
                  </a>

                  <button
                    type="button"
                    onClick={openQuickFindFromMobile}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-900/70 px-4 py-3 text-base font-semibold text-slate-100 transition hover:border-purple-400 hover:text-white"
                  >
                    <Search className="h-5 w-5" />
                    Quick Find
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {isCommandMenuOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-950/80 px-4 pt-20 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Quick navigation search"
          onClick={closeCommandMenu}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-purple-500/30 bg-slate-900/95 shadow-2xl shadow-purple-900/25"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-slate-700/80 p-4 sm:p-5">
              <label className="block">
                <span className="sr-only">Search Zion routes</span>
                <input
                  ref={commandInputRef}
                  value={commandQuery}
                  onChange={(event) => setCommandQuery(event.target.value)}
                  onKeyDown={handleCommandInputKeyDown}
                  placeholder="Search pages, services, or solutions..."
                  className="w-full rounded-xl border border-slate-600/80 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </label>
              <p className="mt-2 text-xs text-slate-400">
                Press Enter to open the highlighted route. Press Esc to close.
              </p>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredQuickAccessLinks.length > 0 ? (
                filteredQuickAccessLinks.map((link, index) => {
                  const isActive = index === activeCommandIndex;

                  return (
                    <button
                      key={link.href}
                      type="button"
                      onClick={() => handleCommandSelect(link.href)}
                      onMouseEnter={() => setActiveCommandIndex(index)}
                      className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                        isActive
                          ? 'bg-purple-500/20 text-white'
                          : 'text-slate-200 hover:bg-slate-800/90 hover:text-white'
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-semibold">{link.name}</span>
                        <span className="mt-0.5 block text-[11px] text-slate-400">
                          {link.group}
                        </span>
                      </span>
                      <span className="rounded-md border border-slate-700 bg-slate-900 px-2 py-0.5 text-[11px] text-slate-300">
                        {link.href}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-xl border border-slate-700/70 bg-slate-950/70 px-4 py-4 text-sm text-slate-300">
                  No matches yet. Try keywords like &ldquo;pricing&rdquo;, &ldquo;support&rdquo;, or
                  &ldquo;automation&rdquo;.
                </div>
              )}
            </div>
            <div className="border-t border-slate-700/80 p-3">
              <a
                href={commandQuery.trim() ? `/search?q=${encodeURIComponent(commandQuery.trim())}` : '/search'}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-600/80 bg-slate-950/50 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-purple-400/40 hover:bg-purple-500/10 hover:text-white"
                onClick={closeCommandMenu}
              >
                Open full search page
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}