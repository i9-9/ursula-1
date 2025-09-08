# Documentación de Tipografías - Ursula Benavidez Portfolio

## Fuente Principal
**Suisse BP INTL** - Fuente principal utilizada en toda la web

### Archivos de Fuente
- `Suisse BP Intl Regular.woff2` (font-weight: 400)
- `Suisse BP Intl Medium.woff2` (font-weight: 500) 
- `Suisse BP Intl Bold.woff2` (font-weight: 700)

## Definiciones de Tamaños de Fuente

### 1. Tamaños Personalizados (text-[Xpx])

#### **9px** - Números de proyecto (más pequeños)
- **Uso**: Números de proyecto en WorksGrid desktop
- **Clase**: `text-[9px]`
- **Ubicación**: 
  - `app/components/WorksGrid.tsx` (línea 65)
  - `app/components/Archive.tsx` (línea 176)

#### **10px** - Texto base y elementos pequeños
- **Uso**: Texto base global, elementos de archivo
- **Clase**: `text-[10px]`
- **CSS Global**: `p { font-size: 10px; }`
- **Ubicación**:
  - `app/globals.css` (línea 124) - Párrafos globales
  - `app/components/Archive.tsx` (líneas 123, 128, 445, 450) - Filtros y elementos de archivo

#### **11px** - Números de proyecto mobile
- **Uso**: Números de proyecto en mobile
- **Clase**: `text-[11px]`
- **Ubicación**:
  - `app/components/OptimizedProjectItem.tsx` (línea 190)
  - `app/components/Archive.tsx` (línea 207)

#### **12px** - Navegación y elementos de interfaz
- **Uso**: Navegación, filtros, elementos de interfaz
- **Clase**: `text-[12px]`
- **CSS Global**: `.navbar-nav-item { font-size: 12px; }`
- **Ubicación**:
  - `app/globals.css` (línea 214) - Items de navegación
  - `app/components/WorksGrid.tsx` (línea 97) - Títulos de proyecto desktop
  - `app/components/Archive.tsx` (líneas 95, 100, 173) - Filtros y elementos de archivo

#### **13px** - Navegación principal
- **Uso**: Enlaces de navegación principal
- **Clase**: `text-[13px]`
- **Ubicación**:
  - `app/components/Navbar.tsx` (líneas 25, 36, 48, 60, 88, 98, 110, 123) - Navegación desktop y mobile

#### **14px** - Títulos de proyecto mobile
- **Uso**: Títulos de proyecto en mobile
- **Clase**: `text-[14px]`
- **Ubicación**:
  - `app/components/OptimizedProjectItem.tsx` (línea 199)
  - `app/components/Archive.tsx` (línea 211)

### 2. Tamaños Tailwind Estándar

#### **text-xs** (12px) - Elementos pequeños
- **Uso**: Información de video, copyright, elementos secundarios
- **Ubicación**:
  - `app/components/VideoPlayer.tsx` (líneas 141, 142, 143, 145, 149, 179)
  - `app/components/ProjectGallerySlider.tsx` (líneas 189, 190, 191, 193, 197)
  - `app/layout.tsx` (línea 97) - Copyright
  - `app/archive/[slug]/VideoPlayer.tsx` (líneas 96, 114, 131, 146)

#### **text-sm** (14px) - Texto secundario
- **Uso**: Mensajes de carga, información secundaria
- **Ubicación**:
  - `app/components/VideoPlayer.tsx` (líneas 29, 130, 139, 179)
  - `app/components/ProjectGallerySlider.tsx` (líneas 12, 169, 171, 187)
  - `app/components/FeaturedProject.tsx` (líneas 27, 181)

#### **text-lg** (18px) - Texto destacado
- **Uso**: Información de artista en galerías
- **Ubicación**:
  - `app/components/ProjectGallerySlider.tsx` (línea 167)

#### **text-xl** (20px) - Títulos secundarios
- **Uso**: Títulos de carga
- **Ubicación**:
  - `app/components/FeaturedProject.tsx` (línea 180)

#### **text-2xl** (24px) - Títulos principales
- **Uso**: Títulos de proyecto en galerías
- **Ubicación**:
  - `app/components/ProjectGallerySlider.tsx` (línea 166)

### 3. Tamaños Inline (style={{ fontSize: 'Xpx' }})

#### **12px** - Logo mobile
- **Uso**: Logo en versión mobile
- **Ubicación**: `app/components/Navbar.tsx` (línea 88)

#### **13px** - Logo desktop
- **Uso**: Logo en versión desktop
- **Ubicación**: `app/components/Navbar.tsx` (línea 25)

## Pesos de Fuente

### **font-weight: 400** (Regular)
- **Uso**: Texto base, párrafos, elementos normales
- **Clase**: `font-normal`
- **CSS**: `font-weight: 400`

### **font-weight: 500** (Medium)
- **Uso**: Títulos, encabezados
- **Clase**: `font-medium`
- **CSS**: `font-weight: 500`

### **font-weight: 700** (Bold)
- **Uso**: Títulos principales, elementos destacados
- **Clase**: `font-bold`
- **CSS**: `font-weight: 700`

## Estilos de Texto

### **Uppercase**
- **Uso**: Navegación, títulos, elementos de interfaz
- **Clase**: `uppercase`
- **Ubicación**: Múltiples componentes

### **Tracking (Letter-spacing)**
- **tracking-wide**: Espaciado amplio para títulos
- **tracking-tight**: Espaciado reducido para elementos compactos

### **Line Height**
- **leading-tight**: `line-height: 1.2` - Para títulos
- **leading-none**: `line-height: 1` - Para elementos compactos
- **line-height: 1.4** - Para texto de archivo
- **line-height: 1.5** - Para texto base global

## Responsive Design

### **Mobile (< 768px)**
- Navegación: `11px` → `10px`
- Elementos de archivo: `10px` → `9px`

### **Desktop (≥ 768px)**
- Navegación: `13px`
- Elementos de archivo: `10px` y `12px`

## Jerarquía de Tamaños

1. **text-2xl (24px)** - Títulos principales de proyecto
2. **text-xl (20px)** - Títulos secundarios
3. **text-lg (18px)** - Información de artista
4. **text-sm (14px)** - Texto secundario, títulos mobile
5. **text-xs (12px)** - Navegación, información de video
6. **text-[13px]** - Navegación principal
7. **text-[12px]** - Títulos desktop, filtros
8. **text-[11px]** - Números mobile
9. **text-[10px]** - Texto base global
10. **text-[9px]** - Números desktop, elementos más pequeños

## Uso por Componente

### **Navbar**
- Desktop: `13px` (navegación), `12px` (logo)
- Mobile: `13px` (navegación), `12px` (logo)

### **WorksGrid**
- Desktop: `9px` (números), `12px` (títulos)
- Mobile: `11px` (números), `14px` (títulos)

### **VideoPlayer**
- Información: `text-xs` (12px)
- Mensajes: `text-sm` (14px)

### **Archive**
- Desktop: `12px` (filtros), `10px` (elementos), `9px` (números)
- Mobile: `10px` (filtros), `9px` (elementos)

### **ProjectGallerySlider**
- Títulos: `text-2xl` (24px)
- Artista: `text-lg` (18px)
- Información: `text-xs` (12px)
