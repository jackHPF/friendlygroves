import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="relative h-10 w-10">
                <Image
                  src="/images/friendly-groves-logo.png"
                  alt="Friendly Groves Logo"
                  fill
                  className="object-contain"
                  sizes="40px"
                />
              </div>
              <h3 className="text-xl font-bold text-white">Friendly Groves</h3>
            </Link>
            <p className="text-sm leading-relaxed">
              Your trusted partner for premium rental accommodations in Vizag.
              Experience comfort, luxury, and exceptional hospitality.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-white">
                  All Properties
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-1 h-4 w-4 flex-shrink-0" />
                <span>Visakhapatnam, Andhra Pradesh, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:info@friendlygroves.co.in" className="hover:text-white">
                  info@friendlygroves.co.in
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+911234567890" className="hover:text-white">
                  +91 XXXXX XXXXX
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="rounded-full bg-gray-800 p-2 transition-colors hover:bg-blue-600"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-full bg-gray-800 p-2 transition-colors hover:bg-blue-600"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-full bg-gray-800 p-2 transition-colors hover:bg-blue-600"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Friendly Groves. All rights reserved.
          </p>
          <p className="mt-2">
            <Link href="#" className="hover:text-white">
              Privacy Policy
            </Link>{' '}
            |{' '}
            <Link href="#" className="hover:text-white">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

