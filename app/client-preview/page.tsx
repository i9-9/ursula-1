import { getHeroSlides } from '@/lib/contentful';
import ClientPreview from '@/app/components/ClientPreview';
import { notFound } from 'next/navigation';

interface ClientPreviewPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ClientPreviewPage({ searchParams }: ClientPreviewPageProps) {
  // Protección básica - requiere clave de acceso
  const resolvedSearchParams = await searchParams;
  const accessKey = resolvedSearchParams.key;
  const validKey = 'client2025'; // Cambia esta clave por una más segura
  
  if (accessKey !== validKey) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <ClientPreviewWrapper />
    </main>
  );
}

async function ClientPreviewWrapper() {
  const heroSlides = await getHeroSlides();
  return <ClientPreview heroSlides={heroSlides} />;
}
