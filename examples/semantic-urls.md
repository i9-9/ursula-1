# URLs Semánticas para Proyectos

## 🎯 **Objetivo**
Transformar URLs automáticas como `/archive/project-1756488232015-26rjpyske` en URLs semánticas y legibles como `/archive/marilina-bertoldi-spotify`.

## 🔗 **Ejemplos de Transformación**

### **Antes (URLs automáticas):**
- `/archive/project-1756488232015-26rjpyske`
- `/archive/project-1756488204539-geapxm19b`
- `/archive/project-1756488205604-t8ujs8mwz`

### **Después (URLs semánticas):**
- `/archive/marilina-bertoldi-spotify`
- `/archive/cuando-sera-aloe`
- `/archive/cosas-para-decirte-conociendo-rusia`

## 🛠️ **Implementación**

### **1. Función de Generación de Slugs**
```typescript
// lib/slug-utils.ts
export function generateSemanticSlug(title: string, artist: string): string {
  return `${title} ${artist}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}
```

### **2. Componente de Enlace Semántico**
```typescript
// components/SemanticLink.tsx
<SemanticLink title="Marilina Bertoldi" artist="Spotify">
  Ver Proyecto
</SemanticLink>
// Genera automáticamente: /archive/marilina-bertoldi-spotify
```

### **3. Hook para URLs**
```typescript
const projectUrl = useSemanticUrl("Marilina Bertoldi", "Spotify");
// Retorna: "/archive/marilina-bertoldi-spotify"
```

## 📋 **Lista Completa de URLs Semánticas**

| Proyecto | Artista | URL Semántica |
|----------|---------|----------------|
| Marilina Bertoldi | Spotify | `/archive/marilina-bertoldi-spotify` |
| Cuándo Será | Aloe | `/archive/cuando-sera-aloe` |
| Cosas para decirte | Conociendo Rusia | `/archive/cosas-para-decirte-conociendo-rusia` |
| Deporte&Casino | Betwarrior | `/archive/deportecasino-betwarrior` |
| Si Quieren Frontear | Duki, De la Ghetto, Quevedo | `/archive/si-quieren-frontear-duki-de-la-ghetto-quevedo` |
| Antes de perderte | Duki | `/archive/antes-de-perderte-duki` |
| Eran otros tiempos | Quilmes | `/archive/eran-otros-tiempos-quilmes` |
| Automatico | Maria Becerra | `/archive/automatico-maria-becerra` |
| BZRP x New Era | MercadoLibre | `/archive/bzrp-x-new-era-mercadolibre` |
| Corazón Vacío | Maria Becerra | `/archive/corazon-vacio-maria-becerra` |
| Kilometros que nos mueven | Bonafont | `/archive/kilometros-que-nos-mueven-bonafont` |
| Mismo Amor | Julieta Venegas | `/archive/mismo-amor-julieta-venegas` |
| Maria Becerra | Spotify | `/archive/maria-becerra-spotify` |
| Sola | Chita | `/archive/sola-chita` |
| Más Feliz | Saramalacara | `/archive/mas-feliz-saramalacara` |
| S.O.S | Taichu ft Lali | `/archive/sos-taichu-ft-lali` |
| Buenos Tiempos | Dillom | `/archive/buenos-tiempos-dillom` |
| Ali Oli | Milo J | `/archive/ali-oli-milo-j` |
| La Pelirroja | Sebastián Yatra | `/archive/la-pelirroja-sebastian-yatra` |
| Con Otra | Cazzu | `/archive/con-otra-cazzu` |
| Punk | Lollapalooza | `/archive/punk-lollapalooza` |
| Personal Flow | Personal | `/archive/personal-flow-personal` |
| Dillom | Spotify | `/archive/dillom-spotify` |

## ✅ **Beneficios**

1. **SEO Mejorado**: URLs más descriptivas y amigables para motores de búsqueda
2. **Mejor UX**: Los usuarios pueden entender qué proyecto están viendo desde la URL
3. **Compartible**: URLs más fáciles de compartir y recordar
4. **Profesional**: Apariencia más profesional y pulida
5. **Accesible**: URLs más legibles para todos los usuarios

## 🔄 **Migración**

- **Rutas existentes**: Se mantienen funcionales durante la transición
- **Nuevas rutas**: Se generan automáticamente con slugs semánticos
- **Redirecciones**: Se pueden implementar para mantener compatibilidad
- **Build time**: Las rutas se generan estáticamente en tiempo de compilación

## 🚀 **Uso en el Código**

```typescript
// En lugar de:
<Link href={`/archive/${project.id}`}>Ver Proyecto</Link>

// Usar:
<SemanticLink title={project.title} artist={project.artist}>
  Ver Proyecto
</SemanticLink>

// O manualmente:
const slug = generateSemanticSlug(project.title, project.artist);
<Link href={`/archive/${slug}`}>Ver Proyecto</Link>
```
