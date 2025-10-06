import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Revalidar todas las páginas principales
    revalidatePath('/');
    revalidatePath('/work');
    revalidatePath('/archive');
    revalidatePath('/about');
    
    // Revalidar páginas dinámicas
    revalidatePath('/work/[slug]', 'page');
    revalidatePath('/archive/[slug]', 'page');
    
    // Revalidar por tags si usas tags en tus fetch
    revalidateTag('projects');
    revalidateTag('contentful');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cache invalidated successfully',
      timestamp: Date.now(),
      contentType: body.sys?.contentType?.sys?.id || 'unknown'
    });
    
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Error processing webhook' }, 
      { status: 500 }
    );
  }
}

// GET para testing
export async function GET() {
  return NextResponse.json({ 
    status: 'Webhook endpoint ready',
    message: 'This endpoint receives Contentful webhooks for cache invalidation',
    timestamp: Date.now()
  });
}