# Configuración del Webhook de Contentful

Este documento explica cómo configurar el webhook de Contentful para que automáticamente revalide el caché de tu sitio web cuando se publiquen cambios.

## ¿Qué es la Revalidación vs Deploy?

### 🚀 Deploy (Lo que NO hacemos)
- Reconstruye toda la aplicación desde cero
- Toma varios minutos
- Consume muchos recursos
- Costoso en términos de tiempo y recursos

### ⚡ Revalidación (Lo que SÍ hacemos)
- **NO genera un nuevo deploy**
- Solo marca las páginas como "desactualizadas"
- Next.js las regenera bajo demanda
- Toma segundos, no minutos
- Mucho más eficiente

**¿Cómo funciona?**

```
1. Build inicial (npm run build)
   ↓
2. Páginas HTML estáticas en el CDN (súper rápido)
   ↓
3. Cambio en Contentful → Webhook → Revalidación
   ↓
4. Next.js marca esas páginas como "stale"
   ↓
5. Próxima visita: Regenera la página en background
   ↓
6. Nueva versión servida (sin rebuild completo)
```

**Ventajas:**
- ✅ Los cambios aparecen en 30-60 segundos
- ✅ No necesitas hacer rebuild completo
- ✅ El sitio sigue siendo estático (rápido)
- ✅ Solo se actualizan las páginas que cambiaron
- ✅ Múltiples cambios se agrupan automáticamente

## Prerequisitos

- Acceso al panel de administración de Contentful
- Tu sitio debe estar desplegado en Vercel (o cualquier plataforma que soporte Next.js)
- Tener acceso a las variables de entorno de tu proyecto en Vercel

## Paso 1: Generar un Token Secreto

Primero necesitas generar un token secreto seguro. Ejecuta este comando en tu terminal:

```bash
openssl rand -base64 32
```

Guarda este token, lo necesitarás en los siguientes pasos.

## Paso 2: Configurar la Variable de Entorno en Vercel

1. Ve a tu proyecto en Vercel (https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Añade una nueva variable:
   - **Name**: `CONTENTFUL_WEBHOOK_SECRET`
   - **Value**: El token que generaste en el Paso 1
   - **Environment**: Selecciona `Production`, `Preview` y `Development` (o solo las que necesites)
5. Haz clic en **Save**

## Paso 3: Re-desplegar tu Sitio

Después de añadir la variable de entorno, necesitas redesplegar tu sitio para que tome efecto:

1. Ve a la pestaña **Deployments** en Vercel
2. Encuentra el último deployment exitoso
3. Haz clic en los tres puntos (**...**) y selecciona **Redeploy**
4. Confirma el redespliegue

## Paso 4: Configurar el Webhook en Contentful

1. Ve a tu espacio en Contentful (https://app.contentful.com/)
2. Navega a **Settings** → **Webhooks**
3. Haz clic en **Add Webhook**
4. Configura los siguientes campos:

### Configuración General

- **Name**: `Next.js Cache Revalidation` (o el nombre que prefieras)
- **URL**: `https://tu-dominio.com/api/revalidate`
  - Reemplaza `tu-dominio.com` con tu dominio real de Vercel
  - Ejemplo: `https://ursula-portfolio.vercel.app/api/revalidate`

### Headers

En la sección de **Headers**, añade un nuevo header:

- **Key**: `Authorization`
- **Value**: `Bearer TU_TOKEN_SECRETO`
  - Reemplaza `TU_TOKEN_SECRETO` con el token que generaste en el Paso 1
  - Ejemplo: `Bearer abc123xyz456...`

### Triggers

Selecciona los eventos que deberían disparar el webhook. Se recomienda:

**Content Type**: Selecciona los content types relevantes (por ejemplo: `project`, `work`, etc.)

**Events**: Marca las siguientes opciones:
- ✅ **Publish** - Cuando se publica una entrada
- ✅ **Unpublish** - Cuando se despublica una entrada
- ✅ **Archive** - Cuando se archiva una entrada
- ✅ **Unarchive** - Cuando se desarchiva una entrada
- ✅ **Delete** - Cuando se elimina una entrada

También puedes seleccionar eventos de Assets si tu sitio depende de ellos:
- ✅ **Asset Publish**
- ✅ **Asset Unpublish**
- ✅ **Asset Archive**
- ✅ **Asset Unarchive**
- ✅ **Asset Delete**

### Filtros (Opcional)

Si solo quieres que ciertos content types disparen el webhook, puedes añadir filtros:

```json
{
  "sys.contentType.sys.id": {
    "in": ["project", "work", "archiveProject"]
  }
}
```

### Configuración Final

- **Active**: ✅ Asegúrate de que esté marcado
- **Retry on failure**: ✅ Recomendado
- Haz clic en **Save**

## Paso 5: Probar el Webhook

### Método 1: Desde Contentful

1. En la configuración del webhook, haz clic en **Test**
2. Verifica que recibas un status `200 OK`
3. Revisa la respuesta JSON que debería verse así:

```json
{
  "success": true,
  "message": "Cache invalidated successfully",
  "timestamp": 1234567890,
  "contentType": "unknown",
  "revalidatedPaths": ["/", "/work", "/archive", "/about", "/work/[slug]", "/archive/[slug]"],
  "revalidatedTags": ["projects", "contentful"]
}
```

### Método 2: Publicar Contenido Real

1. Ve a cualquier entrada en Contentful
2. Haz un pequeño cambio
3. Publica la entrada
4. Verifica en los logs del webhook en Contentful que se disparó correctamente
5. Verifica en tu sitio web que los cambios aparecen (puede tomar unos segundos)

### Verificar Logs en Vercel

1. Ve a tu proyecto en Vercel
2. Navega a **Functions** → **api/revalidate**
3. Verifica los logs para ver las llamadas al webhook

## Troubleshooting

### Error 401 Unauthorized

- Verifica que el header `Authorization` esté correctamente configurado
- Asegúrate de que el token en Contentful coincida exactamente con el de Vercel
- Verifica que incluyas `Bearer ` antes del token (con un espacio)

### Error 500

- Verifica que la variable `CONTENTFUL_WEBHOOK_SECRET` esté configurada en Vercel
- Revisa los logs de Vercel para más detalles

### Los cambios no aparecen inmediatamente

- El webhook solo revalida el caché de Next.js
- Puede haber caché adicional en el navegador o CDN
- Intenta hacer un hard refresh (Cmd+Shift+R en Mac, Ctrl+Shift+R en Windows)
- Los cambios suelen aparecer en 5-30 segundos

### Verificar el endpoint manualmente

Puedes probar el endpoint GET para verificar que está funcionando:

```bash
curl https://tu-dominio.com/api/revalidate
```

Deberías recibir:

```json
{
  "status": "Webhook endpoint ready",
  "message": "This endpoint receives Contentful webhooks for cache invalidation",
  "timestamp": 1234567890,
  "usage": "Send POST request with Contentful webhook payload to invalidate cache"
}
```

## Notas de Seguridad

- **NUNCA** compartas tu `CONTENTFUL_WEBHOOK_SECRET` públicamente
- **NUNCA** lo subas a git (ya está en `.gitignore` como parte de `.env.local`)
- Si crees que tu token ha sido comprometido, genera uno nuevo y actualízalo tanto en Vercel como en Contentful
- Considera usar diferentes tokens para diferentes entornos (production, preview, development)

## Qué hace el webhook

Cuando se dispara, el webhook utiliza un **sistema de debouncing inteligente**:

### Sistema de Agrupación (Debouncing)

El webhook agrupa múltiples cambios para optimizar el rendimiento:

```
Cambio 1 → Webhook recibido → Timer de 2 minutos inicia
Cambio 2 → Webhook recibido → Timer se reinicia (2 min)
Cambio 3 → Webhook recibido → Timer se reinicia (2 min)
... 2 minutos sin cambios ...
→ Se ejecuta UNA SOLA revalidación con todos los cambios
```

**Ventajas:**
- ✅ No sobrecarga el servidor con múltiples revalidaciones
- ✅ Tu clienta puede hacer varios cambios seguidos sin problema
- ✅ Da tiempo suficiente para editar múltiples entradas
- ✅ Solo se procesa UNA revalidación al final
- ✅ Más eficiente y rápido

**Tiempo de espera:** 2 minutos (configurable en `app/api/revalidate/route.ts` línea 7)

### Proceso de Revalidación

1. **Verifica la autenticación** con el token secreto
2. **Agrupa los webhooks** recibidos en los últimos 30 segundos
3. **Ejecuta una revalidación** que incluye:
   - `/` (home)
   - `/work` (página de trabajos)
   - `/archive` (página de archivo)
   - `/about` (página about)
   - Todas las páginas dinámicas de `/work/[slug]`
   - Todas las páginas dinámicas de `/archive/[slug]`
4. **Revalida los tags de cache:**
   - `projects`
   - `contentful`
   - `works-grid`

Esto asegura que Next.js refetch los datos de Contentful en la próxima visita a estas páginas.

### Ejemplo Real

Tu clienta está editando el portfolio:

```
10:00:00 - Publica proyecto A → Webhook 1 recibido (timer inicia: 2 min)
10:01:30 - Publica proyecto B → Webhook 2 recibido (timer reinicia: 2 min)
10:03:00 - Edita proyecto A → Webhook 3 recibido (timer reinicia: 2 min)
10:04:45 - Publica proyecto C → Webhook 4 recibido (timer reinicia: 2 min)
10:06:45 - (2 minutos después del último cambio)
         → Se ejecuta UNA revalidación para los 4 cambios
```

**Resultado:** En lugar de 4 revalidaciones, solo se hace 1, ahorrando recursos y tiempo.

**Tiempo total:** Los cambios aparecen en el sitio aproximadamente 2-3 minutos después del último cambio publicado.

## Soporte

Si tienes problemas con la configuración, verifica:

1. Los logs en Vercel Functions
2. El historial de actividad del webhook en Contentful
3. Las variables de entorno en Vercel

Para más información sobre webhooks de Contentful: https://www.contentful.com/developers/docs/webhooks/
