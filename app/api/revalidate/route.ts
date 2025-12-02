import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

// Sistema de debouncing para agrupar múltiples webhooks
let revalidationTimer: NodeJS.Timeout | null = null;
let pendingWebhooks: Array<{ contentType: string; timestamp: string }> = [];
const DEBOUNCE_TIME = 120000; // 2 minutos (120 segundos)

// Función que ejecuta la revalidación real
async function performRevalidation() {
  try {
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
    revalidateTag('works-grid');

    // Log para debugging
    console.log('🔄 Batch revalidation executed:', {
      webhooksProcessed: pendingWebhooks.length,
      contentTypes: [...new Set(pendingWebhooks.map(w => w.contentType))],
      timestamp: new Date().toISOString(),
      paths: ['/', '/work', '/archive', '/about', '/work/[slug]', '/archive/[slug]'],
      tags: ['projects', 'contentful', 'works-grid']
    });

    // Limpiar webhooks pendientes
    pendingWebhooks = [];

  } catch (error) {
    console.error('❌ Batch revalidation error:', error);
    pendingWebhooks = [];
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar el token secreto del webhook
    const authHeader = request.headers.get('authorization');
    const webhookSecret = process.env.CONTENTFUL_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('CONTENTFUL_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook not properly configured' },
        { status: 500 }
      );
    }

    if (!authHeader || authHeader !== `Bearer ${webhookSecret}`) {
      console.error('Unauthorized webhook attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const contentType = body.sys?.contentType?.sys?.id || 'unknown';

    // Agregar este webhook a la cola de pendientes
    pendingWebhooks.push({
      contentType,
      timestamp: new Date().toISOString()
    });

    // Cancelar timer anterior si existe
    if (revalidationTimer) {
      clearTimeout(revalidationTimer);
    }

    // Programar revalidación para dentro de DEBOUNCE_TIME
    revalidationTimer = setTimeout(() => {
      performRevalidation();
      revalidationTimer = null;
    }, DEBOUNCE_TIME);

    console.log(`⏳ Webhook received (${contentType}). Revalidation scheduled in ${DEBOUNCE_TIME/1000}s. Queue: ${pendingWebhooks.length} webhooks`);

    return NextResponse.json({
      success: true,
      message: 'Revalidation scheduled',
      contentType,
      queuedWebhooks: pendingWebhooks.length,
      willExecuteIn: `${DEBOUNCE_TIME/1000} seconds`,
      debounceTime: DEBOUNCE_TIME,
      timestamp: Date.now(),
      note: 'Multiple changes within 30 seconds will be batched together'
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
    message: 'This endpoint receives Contentful webhooks for cache invalidation with debouncing',
    debounceTime: `${DEBOUNCE_TIME/1000} seconds`,
    currentQueue: pendingWebhooks.length,
    timestamp: Date.now(),
    usage: 'Send POST request with Contentful webhook payload to invalidate cache',
    note: 'Multiple webhooks within 30 seconds will be batched into a single revalidation'
  });
}
