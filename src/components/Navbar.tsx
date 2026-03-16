'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/lib/constants';

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
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-sosa-orange ${
                pathname === link.href ? 'text-sosa-orange' : 'text-gray-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
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
            {NAV_LINKS.map((link) => (
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
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
