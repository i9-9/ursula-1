import { NextResponse } from 'next/server';
import { createClient } from 'contentful';
import { getHeroSlides } from '@/lib/contentful';

/**
 * GET /api/debug/hero-slides
 * Devuelve diagnóstico de qué está trayendo Contentful para hero slides.
 * Útil para ver si el content type existe, si hay entradas, si la imagen viene resuelta.
 */
export async function GET() {
  const hasSpaceId = Boolean(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID);
  const hasToken = Boolean(process.env.CONTENTFUL_ACCESS_TOKEN);
  const envOk = hasSpaceId && hasToken;

  if (!envOk) {
    return NextResponse.json({
      ok: false,
      error: 'Contentful env missing',
      env: { hasSpaceId, hasToken },
    }, { status: 500 });
  }

  try {
    const client = createClient({
      space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
      environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master',
    });

    // Probar content type exacto que usa getHeroSlides
    const response = await client.getEntries({
      content_type: 'heroSlide',
      order: ['fields.order'],
      limit: 20,
      include: 1,
    });

    let triedHeroSlide = false;
    if (response.items.length === 0) {
      triedHeroSlide = true;
      const snakeResponse = await client.getEntries({
        content_type: 'hero_slide',
        limit: 20,
        include: 1,
      });
      if (snakeResponse.items.length > 0) {
        return NextResponse.json({
          ok: true,
          hint: 'Hay entradas con content_type "hero_slide" pero el código usa "heroSlide". Cambia en Contentful el ID del content type a "heroSlide" o actualizamos getHeroSlides a "hero_slide".',
          heroSlideCount: response.items.length,
          hero_slideCount: snakeResponse.items.length,
        });
      }
    }

    const entries = response.items;
    const includes = response.includes;

    const rawEntries = entries.map((item: { sys: { id: string }; fields: Record<string, unknown> }) => {
      const fields = item.fields as {
        title?: string;
        client?: string;
        image?: { sys?: { id: string }; fields?: { file?: { url?: string }; description?: string } };
        videoUrl?: string;
        order?: number;
        project?: unknown;
      };
      const image = fields.image;
      const imageHasFileUrl = Boolean(image?.fields?.file?.url);
      return {
        id: item.sys.id,
        fieldKeys: Object.keys(fields),
        title: fields.title ?? null,
        client: fields.client ?? null,
        order: fields.order ?? null,
        videoUrl: fields.videoUrl ?? null,
        image: image
          ? {
              hasAsset: true,
              hasResolvedFields: Boolean(image.fields),
              hasFileUrl: imageHasFileUrl,
              url: image.fields?.file?.url ? `https:${image.fields.file.url}` : null,
              alt: image.fields?.description ?? null,
            }
          : { hasAsset: false, reason: 'Campo image vacío o no existe' },
      };
    });

    const parsedSlides = await getHeroSlides();

    const listForYou = parsedSlides.map((s, i) => ({
      index: i + 1,
      id: s.id,
      title: s.title,
      client: s.client,
      order: s.order,
      hasImage: Boolean(s.src),
    }));

    return NextResponse.json({
      ok: true,
      summary: {
        contentType: 'heroSlide',
        totalEntries: entries.length,
        totalParsedSlides: parsedSlides.length,
        includesAssets: includes?.Asset?.length ?? 0,
        includesEntries: includes?.Entry?.length ?? 0,
        alsoCheckedHero_slide: triedHeroSlide,
      },
      listadoParaVerificar: listForYou,
      rawEntries: rawEntries,
      parsedSlides: parsedSlides.map((s) => ({
        id: s.id,
        title: s.title,
        client: s.client,
        hasSrc: Boolean(s.src),
        srcLength: s.src?.length ?? 0,
        type: s.type,
        order: s.order,
      })),
      siNoVesTuSlideNuevo: [
        '¿Está publicado? (entrada y asset de imagen en Contentful)',
        '¿Content type es "heroSlide"? (no hero_slide)',
        '¿Tiene el campo "image" con un archivo?',
        'Esperá hasta 60s (ISR) o hacé hard refresh (Cmd+Shift+R)',
      ],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({
      ok: false,
      error: message,
      env: { hasSpaceId, hasToken },
    }, { status: 500 });
  }
}
