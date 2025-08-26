// pages/404.tsx
import ColorSwatches from '@/components/templates/theme-tester';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center bg-background text-foreground">
      <h1 className="text-5xl font-bold mb-4">🚧 Not Implemented</h1>
      <p className="text-lg mb-6 text-muted-foreground">
        This page does not exist or hasn’t been built yet.
      </p>
      <Link
        href="/"
        className="text-primary underline hover:text-primary-foreground"
      >
        Go back home
      </Link>
      <ColorSwatches />
    </div>
  );
}
