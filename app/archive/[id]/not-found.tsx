import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <h1 
        className="text-2xl font-medium mb-4 uppercase" 
        style={{ fontFamily: 'Suisse BP INTL' }}
      >
        Project Not Found
      </h1>
      <p 
        className="text-sm opacity-60 mb-8 text-center"
        style={{ fontFamily: 'Suisse BP INTL' }}
      >
        The project you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link 
        href="/archive"
        className="text-foreground text-sm uppercase hover:opacity-60 transition-opacity"
        style={{ fontFamily: 'Suisse BP INTL' }}
      >
        ← Back to Archive
      </Link>
    </div>
  );
}