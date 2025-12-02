'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Phone, FileText, User, LogOut, Menu, X, Mail } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    // Helper function to check if session is valid (within 4 hours)
    const isSessionValid = (): boolean => {
      const authToken = localStorage.getItem('adminAuth');
      const loginTimestamp = localStorage.getItem('adminLoginTime');
      
      if (!authToken || !loginTimestamp) {
        return false;
      }
      
      const loginTime = parseInt(loginTimestamp, 10);
      if (isNaN(loginTime)) {
        return false;
      }
      
      const currentTime = Date.now();
      const fourHoursInMs = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
      
      // Check if session is still valid (within 4 hours)
      return (currentTime - loginTime) < fourHoursInMs;
    };

    // Check if user is authenticated and session is valid
    if (isSessionValid()) {
      setIsAuthenticated(true);
      setLoading(false);
      
      // Set up periodic check to validate session every minute
      const sessionCheckInterval = setInterval(() => {
        if (!isSessionValid()) {
          // Session expired, clear and redirect
          localStorage.removeItem('adminAuth');
          localStorage.removeItem('adminUsername');
          localStorage.removeItem('adminLoginTime');
          setIsAuthenticated(false);
          router.push('/admin/login');
        }
      }, 60000); // Check every minute
      
      return () => clearInterval(sessionCheckInterval);
    } else {
      // Clear invalid session
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('adminUsername');
      localStorage.removeItem('adminLoginTime');
      setIsAuthenticated(false);
      setLoading(false);
      
      // Redirect to login if not authenticated (except on login page)
      if (!pathname?.includes('/admin/login')) {
        router.push('/admin/login');
      }
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminLoginTime');
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  // Don't show layout on login page
  if (pathname?.includes('/admin/login')) {
    return <>{children}</>;
  }

  // Show loading only if we're still checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not loading, show nothing (redirect is happening)
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Properties', icon: Home },
    { href: '/admin/inquiries', label: 'Inquiries', icon: Mail },
    { href: '/admin/contact', label: 'Contact Details', icon: Phone },
    { href: '/admin/content', label: 'Static Content', icon: FileText },
    { href: '/admin/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-50 h-screen w-64 bg-white shadow-lg transition-transform lg:translate-x-0">
        <div className="flex h-full flex-col">
          {/* Logo/Header */}
          <div className="border-b border-gray-200 p-6">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden bg-white" style={{ borderRadius: '8px', backgroundColor: '#ffffff' }}>
                <div className="absolute inset-0 bg-white z-0"></div>
                <Image
                  src="/images/friendly-groves-logo.png"
                  alt="Friendly Groves Logo"
                  fill
                  className="object-contain p-1 relative z-10"
                  sizes="48px"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
                <p className="text-xs text-gray-600">Friendly Groves</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 lg:hidden">
          <h2 className="text-xl font-semibold text-gray-900">Admin Panel</h2>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex h-full flex-col">
                <div className="border-b border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <Link href="/admin" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                      <div className="relative h-10 w-10 overflow-hidden bg-white" style={{ borderRadius: '8px', backgroundColor: '#ffffff' }}>
                        <div className="absolute inset-0 bg-white z-0"></div>
                        <Image
                          src="/images/friendly-groves-logo.png"
                          alt="Friendly Groves Logo"
                          fill
                          className="object-contain p-1 relative z-10"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <h1 className="text-lg font-bold text-blue-600">Admin Panel</h1>
                        <p className="text-xs text-gray-600">Friendly Groves</p>
                      </div>
                    </Link>
                    <button onClick={() => setMobileMenuOpen(false)}>
                      <X className="h-6 w-6 text-gray-600" />
                    </button>
                  </div>
                </div>
                <nav className="flex-1 space-y-1 p-4">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
                <div className="border-t border-gray-200 p-4">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}

