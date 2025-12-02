import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
      <h2 className="mb-4 text-2xl font-semibold text-gray-700">
        Page Not Found
      </h2>
      <p className="mb-8 text-gray-600">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  );
}

