'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Lock, User } from 'lucide-react';

// Helper function to check if session is valid (within 4 hours)
function isSessionValid(): boolean {
  if (typeof window === 'undefined') return false;
  
  const authToken = localStorage.getItem('adminAuth');
  const loginTimestamp = localStorage.getItem('adminLoginTime');
  
  if (!authToken || !loginTimestamp) {
    return false;
  }
  
  const loginTime = parseInt(loginTimestamp, 10);
  const currentTime = Date.now();
  const fourHoursInMs = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
  
  // Check if session is still valid (within 4 hours)
  return (currentTime - loginTime) < fourHoursInMs;
}

export default function AdminLogin() {
  const router = useRouter();
  
  // Check if already logged in and redirect
  useEffect(() => {
    if (isSessionValid()) {
      router.push('/admin');
    }
  }, [router]);
  
  // Hide header immediately on mount
  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      header.style.display = 'none';
    }
    const footer = document.querySelector('footer');
    if (footer) {
      footer.style.display = 'none';
    }
    return () => {
      // Restore on unmount if needed
      if (header) {
        header.style.display = '';
      }
      if (footer) {
        footer.style.display = '';
      }
    };
  }, []);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store authentication token and login timestamp (in production, use secure httpOnly cookies)
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminUsername', username);
      localStorage.setItem('adminLoginTime', Date.now().toString()); // Store current timestamp

      // Redirect to admin dashboard
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        header {
          display: none !important;
        }
        footer {
          display: none !important;
        }
      ` }} />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
        <div className="w-full max-w-md">
          <div className="rounded-lg bg-white p-8 shadow-xl">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <LogIn className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">Admin Login</h1>
              <p className="text-gray-600">Friendly Groves Admin Panel</p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="block w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Default credentials: admin / admin123</p>
              <p className="mt-2 text-xs text-gray-500">
                Please change the default password after first login
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

