import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Obtener el body del webhook de Contentful
    const body = await request.json();
    
    // Log para debugging
    console.log('Contentful webhook received:', {
      contentType: body.sys?.contentType?.sys?.id,
      action: body.sys?.type,
      timestamp: new Date().toISOString()
    });
    
    // En SSG, no necesitamos revalidar paths
    // Solo confirmamos que recibimos el webhook
    // Vercel automáticamente hará un nuevo build si está configurado
    
    return NextResponse.json({ 
      success: true, 
      message: 'Webhook received, will trigger rebuild on next deployment',
      timestamp: Date.now(),
      contentType: body.sys?.contentType?.sys?.id || 'unknown'
    });
    
  } catch (error) {
    console.error('Error processing webhook:', error);
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
    message: 'This endpoint receives Contentful webhooks for SSG rebuilds',
    timestamp: Date.now()
  });
} 