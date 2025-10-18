# 🌐 Configuración de Caching Multi-Dominio

## 📋 Resumen

Este proyecto está configurado con una estrategia de caching agresiva que funciona en múltiples dominios:

- **`ursulabenavidez.com`** (dominio principal con redirect)
- **`www.ursulabenavidez.com`** (dominio principal)
- **`ursula-b.vercel.app`** (dominio de Vercel)

## 🎯 Estrategia de Caching

### **Principios Fundamentales**

1. **Cache Busting Agresivo**: Las páginas principales nunca se cachean
2. **Assets Estáticos Optimizados**: CSS, JS, imágenes con cache largo
3. **Multi-Dominio**: Headers específicos por dominio
4. **Mobile-First**: Cache busting específico para dispositivos móviles
5. **Revalidación Automática**: API para invalidar cache via webhooks

### **Configuración por Tipo de Contenido**

| Tipo | Estrategia | Duración | Headers Especiales |
|------|------------|----------|-------------------|
| **Páginas HTML** | `no-cache, no-store` | 0 segundos | `X-Cache-Bust`, `X-Domain-Source` |
| **API Routes** | `no-cache, no-store` | 0 segundos | - |
| **Assets estáticos** | `public, max-age=31536000` | 1 año | `immutable` |
| **Imágenes** | `public, max-age=2592000` | 30 días | `must-revalidate` |
| **Mobile /work** | Cache busting específico | Variable | `mobile-work-v20251015` |

## 🔧 Configuración Técnica

### **1. Next.js Config (`next.config.mjs`)**

```javascript
async headers() {
  return [
    {
      source: '/api/(.*)',
      headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }]
    },
    {
      source: '/images/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, must-revalidate' }]
    },
    {
      source: '/(.*)', // TODAS las páginas
      headers: [
        { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate, max-age=0' },
        { key: 'Pragma', value: 'no-cache' },
        { key: 'Expires', value: '0' }
      ]
    }
  ];
}
```

### **2. Vercel Config (`vercel.json`)**

#### **Headers por Dominio**
```json
{
  "source": "/(.*)",
  "has": [{ "type": "host", "value": "ursulabenavidez.com" }],
  "headers": [
    { "key": "X-Domain-Source", "value": "naked-domain" },
    { "key": "X-Cache-Bust", "value": "naked-domain-v20251015" }
  ]
}
```

#### **Headers Específicos por Ruta**
- **`/work/(.*)`**: Cache busting específico para mobile
- **`/archive/(.*)`**: Sin cache para contenido dinámico
- **`/about`**: Sin cache para información actualizada
- **`/`**: Sin cache para página principal

### **3. Scripts de Cache Busting**

#### **Script Principal (`cache-bust.js`)**
- Genera timestamp único: `v20251015-1760486614386`
- Actualiza `package.json` con versión
- Crea `/public/version.json`
- Limpia caché de Next.js y npm
- Genera script de invalidación automática

#### **Script Mobile (`mobile-cache-bust.js`)**
- Versión específica para mobile: `mobile-v20251015-1760475329004`
- Detecta dispositivos móviles automáticamente
- Limpia cache del navegador
- Fuerza recarga de `/work` en mobile

### **4. API de Revalidación (`/api/revalidate`)**

```typescript
// Revalida todas las páginas principales
revalidatePath('/');
revalidatePath('/work');
revalidatePath('/archive');
revalidatePath('/about');

// Revalida páginas dinámicas
revalidatePath('/work/[slug]', 'page');
revalidatePath('/archive/[slug]', 'page');

// Revalida por tags
revalidateTag('projects');
revalidateTag('contentful');
revalidateTag('works-grid');
```

## 🚀 Scripts Disponibles

### **Scripts de Cache Busting**
```bash
# Cache busting completo
npm run cache-bust

# Cache busting específico para mobile
npm run mobile-cache-bust

# Limpiar caché local
npm run clean

# Build con caché limpio
npm run build:clean
```

### **Scripts de Verificación**
```bash
# Probar cache en todos los dominios
npm run test:multi-domain

# Verificación automática (para CI/CD)
npm run verify:cache

# Debug de caché
npm run debug:cache
```

### **Scripts de Deploy**
```bash
# Deploy con cache busting
npm run deploy:fresh
```

## 🔍 Verificación y Testing

### **1. Script de Testing Multi-Dominio**

El script `test-multi-domain-cache.js` prueba:
- ✅ Conectividad en todos los dominios
- ✅ Headers de cache correctos
- ✅ API de revalidación funcionando
- ✅ Cache busting específico por dominio

### **2. Script de Verificación Automática**

El script `verify-multi-domain-cache.js`:
- 🔍 Valida headers de cache automáticamente
- 📊 Genera reporte JSON detallado
- ⚠️ Detecta issues y warnings
- 🚨 Falla en CI/CD si hay problemas críticos

### **3. Verificación Manual**

```bash
# Probar headers en todos los dominios
curl -I https://ursulabenavidez.com
curl -I https://www.ursulabenavidez.com
curl -I https://ursula-b.vercel.app

# Probar API de revalidación
curl -X POST https://www.ursulabenavidez.com/api/revalidate
```

## 📊 Monitoreo y Debugging

### **Archivos de Versión**
- `/public/version.json`: Versión actual del cache busting
- `/public/mobile-cache-bust.json`: Versión específica para mobile
- `cache-verification-report.json`: Reporte de verificación automática

### **Headers de Debugging**
- `X-Cache-Bust`: Versión actual del cache busting
- `X-Domain-Source`: Identifica qué dominio está sirviendo el contenido
- `Cache-Control`: Política de cache aplicada
- `Last-Modified`: Timestamp de la última modificación

### **Logs de Vercel**
- Revisar logs de deploy para confirmar headers
- Monitorear webhooks de Contentful
- Verificar revalidación automática

## ⚡ Optimizaciones Implementadas

### **1. Cache Busting Automático**
- ✅ Cada deploy genera nueva versión
- ✅ Scripts se ejecutan automáticamente
- ✅ Headers se actualizan dinámicamente

### **2. Mobile-First**
- ✅ Detección específica para dispositivos móviles
- ✅ Cache busting optimizado para mobile
- ✅ Headers específicos para `/work` en mobile

### **3. Multi-Dominio**
- ✅ Headers específicos por dominio
- ✅ Identificación de fuente de dominio
- ✅ Cache busting diferenciado

### **4. Integración con Contentful**
- ✅ Revalidación automática via webhooks
- ✅ Tags específicos para diferentes tipos de contenido
- ✅ Invalidación granular por página

## 🔧 Troubleshooting

### **Problemas Comunes**

1. **Cache no se invalida**
   ```bash
   # Verificar versión actual
   cat public/version.json
   
   # Forzar cache busting
   npm run cache-bust
   ```

2. **Headers incorrectos**
   ```bash
   # Verificar headers
   npm run test:multi-domain
   
   # Revisar configuración
   cat vercel.json
   ```

3. **API de revalidación falla**
   ```bash
   # Probar API manualmente
   curl -X POST https://www.ursulabenavidez.com/api/revalidate
   
   # Verificar logs de Vercel
   ```

### **Comandos de Debug**

```bash
# Verificar configuración completa
npm run verify:cache

# Probar todos los dominios
npm run test:multi-domain

# Limpiar todo y empezar fresh
npm run clean && npm install && npm run build
```

## 📈 Métricas y Performance

### **Ventajas de esta Configuración**

- ✅ **Siempre actualizado**: Los usuarios ven cambios inmediatamente
- ✅ **Mobile optimizado**: Cache busting específico para mobile
- ✅ **Performance**: Assets estáticos con cache largo
- ✅ **Debugging**: Versiones trackeables y reportes detallados
- ✅ **Automático**: Scripts que se ejecutan en cada deploy
- ✅ **Multi-dominio**: Funciona correctamente en todos los dominios

### **Consideraciones**

- ⚠️ **Alto tráfico**: Cache busting puede aumentar requests
- ⚠️ **CDN**: Verificar configuración de CDN si se usa
- ⚠️ **Mobile**: Algunos navegadores móviles pueden cachear agresivamente

## 🎯 Próximos Pasos

1. **Monitoreo Continuo**: Ejecutar `npm run verify:cache` regularmente
2. **CI/CD Integration**: Incluir verificación automática en pipeline
3. **Performance Monitoring**: Monitorear métricas de cache hit/miss
4. **User Testing**: Verificar que usuarios ven cambios inmediatamente

---

**Última actualización**: 2025-01-15  
**Versión de cache busting**: v20251015-1760486614386  
**Dominios configurados**: 3 (ursulabenavidez.com, www.ursulabenavidez.com, ursula-b.vercel.app)
