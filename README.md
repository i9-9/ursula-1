# Ursula Portfolio - Next.js SSG

Portfolio profesional con Next.js 15 y Static Site Generation (SSG) para máximo rendimiento.

## 🚀 **Scripts Disponibles:**

### **Desarrollo:**
```bash
npm run dev          # Desarrollo local con hot reload
```

### **Producción (SSG):**
```bash
npm run build:prod   # Build optimizado para SSG
npm run start:prod   # Servir build de producción
npm run export       # Export estático completo
```

## 📁 **Configuraciones:**

- **`next.config.mjs`**: Desarrollo (sin export estático)
- **`next.config.production.mjs`**: Producción (con export estático)
- **`vercel.json`**: Configuración de Vercel para SSG

## 🔧 **Flujo de Trabajo:**

### **1. Desarrollo:**
- Usar `npm run dev`
- Datos se traen en cada request (como antes)
- Hot reload y debugging completo

### **2. Testing de Producción:**
```bash
# Construir como en producción
npm run build:prod

# Servir localmente
npm run start:prod
```

### **3. Deploy:**
- Vercel usa automáticamente `next.config.production.mjs`
- Webhook de Contentful dispara rebuilds automáticos
- Sitio estático súper rápido

## 📊 **Beneficios del SSG:**

- ⚡ **10-50x más rápido** que SSR
- 🌍 **CDN global** en 200+ ciudades
- 💰 **80-90% menos recursos** por visita
- 🔄 **Actualización automática** vía webhook

## 🌐 **Variables de Entorno:**

```bash
# .env.local
CONTENTFUL_SPACE_ID=tu_space_id
CONTENTFUL_ACCESS_TOKEN=tu_token_dev
NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT=master
```

## 📝 **Notas:**

- **Desarrollo**: Configuración estándar para debugging
- **Producción**: SSG optimizado para máximo rendimiento
- **Webhook**: `/api/revalidate` para rebuilds automáticos
- **Cache**: Headers optimizados para CDN global

## 🚨 **Solución de Problemas:**

Si hay conflictos con Contentful:
1. Verificar variables de entorno
2. Usar `npm run build:prod` para testing
3. Revisar logs de build para errores de Contentful
