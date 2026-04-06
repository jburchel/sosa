'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { NAV_LINKS, type NavLink } from '@/lib/constants';

function DesktopDropdown({ link, pathname }: { link: NavLink; pathname: string }) {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = pathname === link.href || link.children?.some((c) => pathname === c.href);

  function handleEnter() {
    if (timeout.current) clearTimeout(timeout.current);
    setOpen(true);
  }

  function handleLeave() {
    timeout.current = setTimeout(() => setOpen(false), 150);
  }

  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current); }, []);

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <Link
        href={link.href}
        className={`text-sm font-medium transition-colors hover:text-sosa-orange ${
          isActive ? 'text-sosa-orange' : 'text-gray-300'
        }`}
      >
        {link.label}
        <svg className="inline-block ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Link>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-sosa-black border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
          {link.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={`block px-4 py-3 text-sm transition-colors hover:bg-sosa-dark hover:text-sosa-orange ${
                pathname === child.href ? 'text-sosa-orange bg-sosa-dark' : 'text-gray-300'
              }`}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileDropdown({ link, pathname, onNavigate }: { link: NavLink; pathname: string; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const isActive = pathname === link.href || link.children?.some((c) => pathname === c.href);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between text-sm font-medium py-2 transition-colors hover:text-sosa-orange ${
          isActive ? 'text-sosa-orange' : 'text-gray-300'
        }`}
      >
        {link.label}
        <svg
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="ml-4 border-l border-gray-700 pl-4 flex flex-col gap-1">
          {link.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onNavigate}
              className={`text-sm py-2 transition-colors hover:text-sosa-orange ${
                pathname === child.href ? 'text-sosa-orange' : 'text-gray-400'
              }`}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-sosa-black/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/s1-logo.png"
            alt="SOSA Basketball"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <span className="font-bold text-lg hidden sm:block">SOSA</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) =>
            link.children ? (
              <DesktopDropdown key={link.href} link={link} pathname={pathname} />
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-sosa-orange ${
                  pathname === link.href ? 'text-sosa-orange' : 'text-gray-300'
                }`}
              >
                {link.label}
              </Link>
            ),
          )}
        </div>

        {/* Register Button + Hamburger */}
        <div className="flex items-center gap-4">
          <Link
            href="/register"
            className="bg-sosa-orange text-black font-bold text-sm px-4 py-2 rounded hover:bg-orange-500 transition-colors"
          >
            Register a New Player
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-white"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-sosa-black border-t border-gray-800">
          <div className="px-4 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <MobileDropdown
                  key={link.href}
                  link={link}
                  pathname={pathname}
                  onNavigate={() => setMenuOpen(false)}
                />
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm font-medium py-2 transition-colors hover:text-sosa-orange ${
                    pathname === link.href ? 'text-sosa-orange' : 'text-gray-300'
                  }`}
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
