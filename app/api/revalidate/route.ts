import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // Obtener el body del webhook
    const body = await request.json();
    
    console.log('Revalidation triggered by Contentful:', {
      contentType: body.sys?.contentType?.sys?.id,
      action: body.sys?.type,
    });
    
    // Revalidar páginas específicas según el tipo de contenido
    const contentType = body.sys?.contentType?.sys?.id;
    
    switch (contentType) {
      case 'heroSlide':
      case 'portfolioItem':
      case 'archiveItem':
      case 'archiveSection':
        // Revalidar la página principal
        revalidatePath('/');
        console.log('Revalidated homepage for content type:', contentType);
        break;
      
      default:
        // Por defecto, revalidar la página principal
        revalidatePath('/');
        console.log('Revalidated homepage for unknown content type:', contentType);
    }
    
    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      contentType: contentType || 'unknown'
    });
    
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Error revalidating' }, 
      { status: 500 }
    );
  }
}

// Opcional: Permitir GET para testing
export async function GET() {
  try {
    revalidatePath('/');
    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      method: 'GET'
    });
  } catch {
    return NextResponse.json(
      { error: 'Error revalidating' }, 
      { status: 500 }
    );
  }
} 