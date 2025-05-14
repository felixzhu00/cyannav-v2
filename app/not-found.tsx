// pages/404.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="text-5xl font-bold mb-4">🚧 Not Implemented</h1>
      <p className="text-lg mb-6 text-gray-600 dark:text-gray-400">
        This page does not exist or hasn’t been built yet.
      </p>
      <Link href="/" className="text-blue-600 hover:underline">
        Go back home
      </Link>
    </div>
  );
}
