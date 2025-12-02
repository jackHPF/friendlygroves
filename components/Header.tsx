'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, Home, Calendar, Phone, Shield } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-20 w-20 overflow-hidden bg-white md:h-24 md:w-24" style={{ borderRadius: '8px', backgroundColor: '#ffffff' }}>
            <div className="absolute inset-0 bg-white z-0"></div>
            <Image
              src="/images/friendly-groves-logo.png"
              alt="Friendly Groves Logo"
              fill
              className="object-contain p-1 relative z-10"
              priority
              sizes="(max-width: 768px) 80px, 96px"
            />
          </div>
          <span className="hidden text-xl font-bold text-blue-600 md:block">
            Friendly Groves
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-700 transition-colors hover:text-blue-600"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link
            href="/properties"
            className="flex items-center gap-2 text-gray-700 transition-colors hover:text-blue-600"
          >
            <Calendar className="h-4 w-4" />
            Properties
          </Link>
          <Link
            href="/about"
            className="text-gray-700 transition-colors hover:text-blue-600"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 transition-colors hover:text-blue-600"
          >
            Contact
          </Link>
          <Link
            href="/admin/login"
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            <Shield className="h-4 w-4" />
            Admin
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="flex flex-col space-y-4 px-4 py-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/properties"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Calendar className="h-4 w-4" />
              Properties
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/admin/login"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

