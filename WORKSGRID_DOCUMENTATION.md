# WorksGrid: Documentación Técnica

## Descripción General

`WorksGrid` es el componente principal que renderiza la galería de proyectos del portfolio de Ursula Benavidez. Utiliza un sistema de CSS Grid con 4 columnas para lograr alineación perfecta de números, imágenes y títulos tanto horizontal como verticalmente.

## ✅ Solución Implementada: Imágenes Portrait y Spacing

### Problema Resuelto
- **Antes**: Todas las imágenes ocupaban el mismo ancho sin importar su aspect ratio
- **Antes**: Números y títulos estaban muy lejos verticalmente de las imágenes (1.25rem)
- **Antes**: No había diferenciación visual entre imágenes portrait y landscape/square

### Solución Implementada
- **Ahora**: Contenedor mantiene ancho fijo (`w-5/6 max-w-[380px]`) para todos los proyectos
- **Ahora**: Imágenes portrait son más estrechas (`w-1/2`) dentro del contenedor, creando espacio negativo
- **Ahora**: Números y títulos están muy cerca de las imágenes (`-top-0.5`, `-bottom-0.5`)
- **Ahora**: Diferentes anchos crean jerarquía visual y ritmo dinámico

### Implementación Técnica

#### 1. Contenedor Fijo (WorksGrid.tsx)
```jsx
// Contenedor principal con ancho fijo para TODOS
<div className="relative w-5/6 max-w-[380px]">
  {/* Número - alineado con el borde derecho de la imagen (excepto portrait) */}
  <div className="absolute -top-0.5 left-0 w-full flex justify-center z-30">
    <div className={`${
      orientation === 'portrait' ? 'w-full flex justify-end' : 
      orientation === 'landscape' ? 'w-full flex justify-end' : 'w-5/6 flex justify-end'
    }`}>
      <span className="font-normal text-foreground text-[9px]">
        {projectNumber}
      </span>
    </div>
  </div>
  
  {/* Contenedor de imagen con altura fija */}
  <div className="flex items-center justify-center h-[300px]">
    <OptimizedProjectItem
      // ... props
      imageOrientation={orientation} // ✅ Nueva prop
    />
  </div>
  
  {/* Título - alineado con el borde izquierdo de la imagen */}
  <div className="absolute -bottom-0.5 left-0 w-full flex justify-center">
    <div className={`${
      orientation === 'portrait' ? 'w-1/2' : 
      orientation === 'landscape' ? 'w-full' : 'w-5/6'
    }`}>
      <p className="...">
        {project.title}, {project.artist}
      </p>
    </div>
  </div>
</div>
```

#### 2. Detección de Orientación
```typescript
const getImageOrientation = (project: Project): 'portrait' | 'landscape' | 'square' => {
  const title = project.title.toLowerCase();
  const artist = project.artist.toLowerCase();
  
  // Heurísticas para detectar orientación
  if (title.includes('portrait') || title.includes('vertical') || 
      artist.includes('portrait') || artist.includes('vertical') ||
      title.includes('tall') || title.includes('narrow')) {
    return 'portrait';
  }
  
  if (title.includes('landscape') || title.includes('horizontal') || 
      artist.includes('landscape') || artist.includes('horizontal') ||
      title.includes('wide') || title.includes('panoramic')) {
    return 'landscape';
  }
  
  return 'square';
};
```

#### 3. Clases Condicionales (OptimizedProjectItem.tsx)
```typescript
const getImageClasses = () => {
  if (!skipContainer) return 'w-full'; // Mobile mantiene ancho completo
  
  switch(imageOrientation) {
    case 'portrait':
      return 'w-1/2 mx-auto'; // 50% del contenedor, centrado
    case 'landscape':
      return 'w-full'; // 100% del contenedor
    default:
      return 'w-5/6 mx-auto'; // 83% del contenedor, centrado
  }
};
```

### Resultados Visuales

| Orientación | Ancho Imagen | Efecto Visual |
|-------------|--------------|---------------|
| **Portrait** | `w-1/2` (50%) | ✅ Crea espacio negativo significativo a los lados |
| **Square** | `w-5/6` (83%) | ✅ Pequeño espacio negativo balanceado |
| **Landscape** | `w-full` (100%) | ✅ Ocupa todo el ancho del contenedor |

### Tamaños Actualizados

| Elemento | Valor Anterior | Valor Actual | Resultado |
|----------|----------------|--------------|-----------|
| **Contenedor** | `w-3/4 max-w-[240px]` | `w-5/6 max-w-[380px]` | ✅ Imágenes 58% más grandes |
| **Square** | `w-4/5` (80%) | `w-5/6` (83%) | ✅ Mejor proporción |
| **Portrait** | `w-1/2` (50%) | `w-1/2` (50%) | ✅ Sin cambios |
| **Landscape** | `w-full` (100%) | `w-full` (100%) | ✅ Sin cambios |

### Espaciados Ajustados

| Elemento | Valor Anterior | Valor Actual | Resultado |
|----------|----------------|--------------|-----------|
| **Número** | `-top-5` (1.25rem) | `-top-0.5` (0.125rem) | ✅ Muy cerca de la imagen |
| **Título** | `-bottom-5` (1.25rem) | `-bottom-0.5` (0.125rem) | ✅ Muy cerca de la imagen |
| **Altura contenedor** | Variable | `h-[300px]` | ✅ Altura consistente |

### Ventajas de la Solución
- ✅ **Mantiene la estructura del grid** - El grid de 4 columnas permanece intacto
- ✅ **Crea jerarquía visual** - Las imágenes portrait destacan por su espacio negativo
- ✅ **Mejora la proximidad** - Números y títulos más cerca de las imágenes
- ✅ **Alineación perfecta** - Los títulos se alinean con el borde izquierdo de la imagen real
- ✅ **Performance optimizada** - Memoización de componentes y clases de Tailwind compiladas
- ✅ **Accesibilidad mejorada** - Navegación por teclado y roles ARIA
- ✅ **Detección robusta** - Múltiples métodos para detectar orientación de imágenes
- ✅ **Fácil de mantener** - Un solo lugar para ajustar espaciados

### Alineación de Títulos: Solución Implementada

#### Problema Original
- Los títulos estaban alineados con el contenedor (`left-0`)
- Esto causaba desalineación visual cuando las imágenes eran más estrechas que el contenedor

#### Solución Implementada
```jsx
{/* Título - alineado con el borde izquierdo de la imagen */}
<div className="absolute -bottom-2 left-0 w-full flex justify-center">
  <div className={`${
    orientation === 'portrait' ? 'w-1/2' : 
    orientation === 'landscape' ? 'w-full' : 'w-5/6'
  }`}>
    <p className="...">
      {project.title}, {project.artist}
    </p>
  </div>
</div>
```

#### Cómo Funciona
1. **Contenedor externo**: `w-full flex justify-center` - Centra el contenido
2. **Contenedor interno**: Ancho condicional que coincide con la imagen
3. **Resultado**: El título se alinea perfectamente con el borde izquierdo de la imagen

#### Resultados por Orientación
- **Portrait**: Título alineado con imagen estrecha (50% del contenedor)
- **Square**: Título alineado con imagen cuadrada (83% del contenedor)  
- **Landscape**: Título alineado con imagen ancha (100% del contenedor)

### Mejoras de Performance Implementadas

#### 1. Memoización de Componentes
```jsx
// Componente memoizado para cada proyecto individual
const ProjectItem = memo(({ 
  project, 
  globalIndex, 
  projectNumber, 
  orientation, 
  hoveredProject, 
  setHoveredProject, 
  preloadProjectAsync, 
  getVideoSource, 
  isVideoProject, 
  isImageProject 
}) => {
  // ... contenido del proyecto
});

ProjectItem.displayName = 'ProjectItem';
```

#### 2. Detección de Orientación Optimizada
```typescript
const getImageOrientation = (project: Project): 'portrait' | 'landscape' | 'square' => {
  // Opción 1: Basado en metadata del proyecto (si está disponible)
  if ('aspectRatio' in project && project.aspectRatio) {
    const ratio = project.aspectRatio as number;
    if (ratio > 1.3) return 'portrait';
    if (ratio < 0.77) return 'landscape';
    return 'square';
  }
  
  // Opción 2: Basado en título/artista (heurísticas mejoradas)
  const title = project.title.toLowerCase();
  const artist = project.artist.toLowerCase();
  
  // Heurísticas para detectar orientación
  if (title.includes('portrait') || title.includes('vertical') || 
      artist.includes('portrait') || artist.includes('vertical') ||
      title.includes('tall') || title.includes('narrow') ||
      title.includes('retrato') || title.includes('vertical')) {
    return 'portrait';
  }
  
  if (title.includes('landscape') || title.includes('horizontal') || 
      artist.includes('landscape') || artist.includes('horizontal') ||
      title.includes('wide') || title.includes('panoramic') ||
      title.includes('paisaje') || title.includes('horizontal')) {
    return 'landscape';
  }
  
  // Opción 3: Basado en URL de imagen (fallback)
  const imageUrl = project.thumbnail || project.images?.[0];
  if (imageUrl) {
    if (imageUrl.includes('400/600') || imageUrl.includes('600/900')) return 'portrait';
    if (imageUrl.includes('600/400') || imageUrl.includes('900/600')) return 'landscape';
  }
  
  return 'square';
};
```

### Mejoras de Accesibilidad Implementadas

#### 1. Navegación por Teclado
```jsx
<Link
  href={`/work/${generateSemanticSlug(project.title, project.artist)}`}
  aria-label={`Ver ${project.title} by ${project.artist}`}
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = `/work/${generateSemanticSlug(project.title, project.artist)}`;
    }
  }}
>
```

#### 2. Roles ARIA y Atributos de Accesibilidad
- **role="button"**: Indica que el elemento es interactivo
- **tabIndex={0}**: Permite navegación por teclado
- **aria-label**: Proporciona descripción accesible
- **onKeyDown**: Maneja eventos de teclado (Enter y Espacio)

#### 3. Beneficios de Accesibilidad
- ✅ **Navegación por teclado** - Usuarios pueden navegar con Tab/Enter
- ✅ **Screen readers** - Descripciones claras de cada proyecto
- ✅ **Navegación consistente** - Comportamiento predecible
- ✅ **Cumplimiento WCAG** - Estándares de accesibilidad web

### Alineación de Números: Solución Implementada

#### Problema Original
- Los números estaban alineados con el borde derecho del contenedor (`right-0`)
- Esto causaba desalineación visual cuando las imágenes eran más estrechas que el contenedor

#### Solución Implementada
```jsx
{/* Número - alineado con el borde derecho de la imagen (excepto portrait) */}
<div className="absolute -top-2 left-0 w-full flex justify-center z-30">
  <div className={`${
    orientation === 'portrait' ? 'w-full flex justify-end' : 
    orientation === 'landscape' ? 'w-full flex justify-end' : 'w-5/6 flex justify-end'
  }`}>
    <span className="font-normal text-foreground text-[9px]">
      {projectNumber}
    </span>
  </div>
</div>
```

#### Cómo Funciona
1. **Contenedor externo**: `w-full flex justify-center` - Centra el contenido
2. **Contenedor interno**: Ancho condicional que coincide con la imagen + `justify-end`
3. **Resultado**: El número se alinea perfectamente con el borde derecho de la imagen real

#### Resultados por Orientación
- **Portrait**: Número alineado con el borde derecho del contenedor (mantiene posición original)
- **Square**: Número alineado con imagen cuadrada (83% del contenedor)
- **Landscape**: Número alineado con imagen ancha (100% del contenedor)

## Estructura del Componente

### Props
```typescript
interface WorksGridProps {
  works: Project[]; // Array de proyectos desde Contentful
}
```

### Estado Interno
```typescript
const [hoveredProject, setHoveredProject] = useState<string | null>(null);
```

## Layouts Responsivos

### Mobile/Tablet Layout (`lg:hidden`)
- **Estructura**: Stack vertical con `space-y-16`
- **Comportamiento**: Cada proyecto se renderiza individualmente
- **Características**:
  - Números y títulos renderizados por `OptimizedProjectItem`
  - Padding horizontal: `px-6`
  - Spacing entre proyectos: `space-y-16`

### Desktop Layout (`hidden lg:block`)
- **Estructura**: CSS Grid simple con contenedor unificado por proyecto
- **Grid Configuration**:
  ```css
  grid-template-columns: repeat(4, 1fr)
  gap: 3rem  /* gap-12 */
  ```
- **Enfoque**: Cada proyecto tiene un contenedor único que maneja número, imagen y título

## Sistema de Contenedor Unificado

### Estructura por Proyecto
```jsx
<div key={project.id} className="flex justify-center">
  {/* Contenedor principal con ancho dinámico basado en aspect ratio */}
  <div className={`relative ${config.container}`}>
    
    {/* Número - más cerca de la imagen */}
    <div className={`absolute ${config.numberOffset} right-0 z-30`}>
      <span className="font-normal text-foreground text-[9px]">
        {projectNumber}
      </span>
    </div>
    
    {/* Contenedor de imagen con altura dinámica y centrado vertical */}
    <div className={`flex items-center justify-center ${config.height}`}>
      <OptimizedProjectItem
        project={project}
        index={globalIndex}
        hoveredProject={hoveredProject}
        setHoveredProject={setHoveredProject}
        onPreloadProject={preloadProjectAsync}
        getVideoSource={getVideoSource}
        isVideoProject={isVideoProject}
        isImageProject={isImageProject}
        isMobile={false}
        showNumber={false}
        showTitle={false}
        projectNumber=""
        skipContainer={true}
      />
    </div>
    
    {/* Título - más cerca de la imagen */}
    <div className={`absolute ${config.titleOffset} left-0 w-full`}>
      <p className={`font-normal uppercase tracking-wide text-foreground text-left leading-tight text-[12px] transition-opacity duration-300 ${
        hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
      }`}>
        {project.title}, {project.artist}
      </p>
    </div>
    
  </div>
</div>
```

### Sistema de Anchos Fijos (Implementado)

#### Contenedor Unificado
```jsx
// Contenedor principal con ancho fijo para TODOS los proyectos
<div className="relative w-3/4 max-w-[240px]">
  {/* Número - alineado con el borde derecho de la imagen (excepto portrait) */}
  <div className="absolute -top-0.5 left-0 w-full flex justify-center z-30">
    <div className={`${
      orientation === 'portrait' ? 'w-full flex justify-end' : 
      orientation === 'landscape' ? 'w-full flex justify-end' : 'w-5/6 flex justify-end'
    }`}>
      <span className="font-normal text-foreground text-[9px]">
        {projectNumber}
      </span>
    </div>
  </div>
  
  {/* Contenedor de imagen con altura fija */}
  <div className="flex items-center justify-center h-[300px]">
    <OptimizedProjectItem
      // ... props
      imageOrientation={orientation} // Nueva prop para orientación
    />
  </div>
  
  {/* Título - alineado con el borde izquierdo de la imagen */}
  <div className="absolute -bottom-0.5 left-0 w-full flex justify-center">
    <div className={`${
      orientation === 'portrait' ? 'w-1/2' : 
      orientation === 'landscape' ? 'w-full' : 'w-5/6'
    }`}>
      <p className="...">
        {project.title}, {project.artist}
      </p>
    </div>
  </div>
</div>
```

#### Detección de Orientación (Optimizada)
```typescript
const getImageOrientation = (project: Project): 'portrait' | 'landscape' | 'square' => {
  const title = project.title.toLowerCase();
  const artist = project.artist.toLowerCase();
  
  // Heurísticas para detectar orientación
  if (title.includes('portrait') || title.includes('vertical') || 
      artist.includes('portrait') || artist.includes('vertical') ||
      title.includes('tall') || title.includes('narrow')) {
    return 'portrait';
  }
  
  if (title.includes('landscape') || title.includes('horizontal') || 
      artist.includes('landscape') || artist.includes('horizontal') ||
      title.includes('wide') || title.includes('panoramic')) {
    return 'landscape';
  }
  
  return 'square';
};
```

#### Clases Condicionales en OptimizedProjectItem
```typescript
const getImageClasses = () => {
  if (!skipContainer) return 'w-full'; // Mobile mantiene ancho completo
  
  switch(imageOrientation) {
    case 'portrait':
      return 'w-1/2 mx-auto'; // 50% del contenedor, centrado
    case 'landscape':
      return 'w-full'; // 100% del contenedor
    default:
      return 'w-5/6 mx-auto'; // 83% del contenedor, centrado
  }
};
```

### Características del Sistema Implementado

#### Números
- **Posición**: Fija `-top-0.5` (0.125rem) para todos los proyectos
- **Alineación**: ✅ Alineado con el borde derecho de la imagen real (condicional según orientación)
- **Z-index**: `z-30` para estar sobre overlays
- **Proximidad**: ✅ Muy cerca de la imagen (0.125rem)
- **Comportamiento por orientación**:
  - Portrait: Alineado con el borde derecho del contenedor (mantiene posición original)
  - Square: Alineado con el borde derecho de la imagen cuadrada (83% del contenedor)
  - Landscape: Alineado con el borde derecho de la imagen ancha (100% del contenedor)

#### Imágenes
- **Posición**: Centradas verticalmente en contenedor de altura fija
- **Alineación**: `items-center` en contenedor de altura fija (`h-[300px]`)
- **Componente**: `OptimizedProjectItem` con `skipContainer={true}`
- **Aspect Ratio**: Mantiene proporciones naturales
- **Ancho**: ✅ Condicional según orientación:
  - Portrait: `w-1/2` (50%) - Crea espacio negativo significativo
  - Square: `w-5/6` (83%) - Pequeño espacio negativo balanceado
  - Landscape: `w-full` (100%) - Ocupa todo el ancho
- **Contenedor**: `w-5/6 max-w-[380px]` - 58% más grande que el original

#### Títulos
- **Posición**: Fija `-bottom-0.5` (0.125rem) para todos los proyectos
- **Alineación**: ✅ Alineado con el borde izquierdo del contenedor (consistente para todas las orientaciones)
- **Visibilidad**: Solo en hover (`opacity-0` → `opacity-100`)
- **Proximidad**: ✅ Muy cerca de la imagen (0.125rem)
- **Ancho**: Consistente para todas las orientaciones:
  - Portrait: Alineado con borde izquierdo del contenedor
  - Square: Alineado con borde izquierdo del contenedor
  - Landscape: Alineado con borde izquierdo del contenedor

## OptimizedProjectItem: Nuevas Props

### Props Actualizadas
```typescript
interface OptimizedProjectItemProps {
  // ... props existentes
  skipContainer?: boolean; // Prop para saltar el contenedor w-3/4
  imageOrientation?: 'portrait' | 'landscape' | 'square'; // ✅ Nueva prop
}
```

### Función de Clases Condicionales
```typescript
const getImageClasses = () => {
  if (!skipContainer) return 'w-full'; // Mobile mantiene ancho completo
  
  switch(imageOrientation) {
    case 'portrait':
      return 'w-1/2 mx-auto'; // 50% del contenedor, centrado
    case 'landscape':
      return 'w-full'; // 100% del contenedor
    default:
      return 'w-5/6 mx-auto'; // 83% del contenedor, centrado
  }
};
```

### Uso en WorksGrid
```jsx
<OptimizedProjectItem
  project={project}
  index={globalIndex}
  hoveredProject={hoveredProject}
  setHoveredProject={setHoveredProject}
  onPreloadProject={preloadProjectAsync}
  getVideoSource={getVideoSource}
  isVideoProject={isVideoProject}
  isImageProject={isImageProject}
  isMobile={false}
  showNumber={false}
  showTitle={false}
  projectNumber=""
  skipContainer={true}
  imageOrientation={orientation} // ✅ Nueva prop implementada
/>
```

## Hooks y Funciones Auxiliares

### useAssetPreloader
```typescript
const { preloadProjectAsync } = useAssetPreloader({ 
  projects: works, 
  preloadCount: 6,
  isMobile: isMobile || false
});
```
- **Propósito**: Precarga assets críticos (solo desktop)
- **Configuración**: Primeros 6 proyectos, deshabilitado en mobile

### useIsMobile
```typescript
const isMobile = useIsMobile(1024); // lg breakpoint
```
- **Propósito**: Detectar si estamos en mobile/tablet
- **Breakpoint**: 1024px (lg de Tailwind)

### Funciones de Detección de Tipo de Proyecto
```typescript
// Video projects
const isVideoProject = (project: Project) => {
  return !!(project.videoUrl || project.vimeoId || project.youtubeUrl || project.videoThumbnail);
};

// Image projects  
const isImageProject = (project: Project) => {
  return !!(project.images && project.images.length > 0);
};

// Video file detection
const isVideoFile = (url: string) => {
  return url.includes('.mp4') || url.includes('.mov') || url.includes('.webm') || url.includes('.avi');
};
```

## OptimizedProjectItem: Componente de Imagen

### Props
```typescript
interface OptimizedProjectItemProps {
  project: Project;
  index: number;
  hoveredProject: string | null;
  setHoveredProject: (id: string | null) => void;
  onPreloadProject: (project: Project) => void;
  getVideoSource: (project: Project) => string;
  isVideoProject: (project: Project) => boolean;
  isImageProject: (project: Project) => boolean;
  isMobile?: boolean;
  showNumber?: boolean;
  showTitle?: boolean;
  projectNumber: string;
  skipContainer?: boolean; // Nueva prop para saltar contenedores adicionales
}
```

### Funcionalidades

#### Lazy Loading
```typescript
const {
  elementRef,
  hasApproached,
  handleMouseEnter,
  handleMouseLeave
} = useLazyHover({
  threshold: isMobile ? 0 : 100,
  onApproach: () => {
    if (index >= 6 && !isMobile) {
      onPreloadProject(project);
    }
  }
});
```

#### Hover States
```typescript
const handleMouseEnterProject = () => {
  setHoveredProject(project.id);
  handleMouseEnter();
};

const handleMouseLeaveProject = () => {
  setHoveredProject(null);
  handleMouseLeave();
};
```

#### Renderizado Condicional
- **Mobile**: Renderiza números y títulos si `showNumber`/`showTitle` son `true`
- **Desktop**: Números y títulos manejados por `WorksGrid` (contenedor unificado)
- **skipContainer**: Cuando `true`, renderiza solo la imagen sin contenedores adicionales

## Sistema de Alineación

### Problema Resuelto
El sistema anterior tenía conflictos entre:
- **Números**: Necesitaban alineación horizontal (requería `items-start`)
- **Imágenes**: Necesitaban centrado vertical (requería `items-center`)
- **Títulos**: Necesitaban alineación horizontal (requería `items-start`)

### Solución: Contenedor Unificado con Centrado Vertical
```css
/* Contenedor principal por proyecto */
.contenedor-proyecto {
  position: relative;
  width: 75%;
  max-width: 240px;
}

/* Contenedor intermedio para centrar imagen */
.contenedor-imagen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px; /* h-[300px] */
}

.numero {
  position: absolute;
  top: -1.25rem;    /* -top-5 */
  right: 0;
  z-index: 30;
}

.titulo {
  position: absolute;
  bottom: -1.25rem; /* -bottom-5 */
  left: 0;
  width: 100%;
}
```

### Ventajas del Sistema Actual
- **Simplicidad**: Un solo contenedor por proyecto con contenedor intermedio para imagen
- **Precisión**: Números y títulos se alinean con los bordes reales de la imagen
- **Centrado Vertical**: Imágenes centradas entre sí sin afectar números/títulos
- **Anchos Dinámicos**: Diferentes anchos según aspect ratio crean espacio natural
- **Proximidad Optimizada**: Números y títulos más cerca de las imágenes
- **Layout Inteligente**: Imágenes verticales más estrechas, horizontales más anchas
- **Mantenibilidad**: Código más limpio y fácil de entender
- **Performance**: Menos renders que el sistema de 3 filas

## Gestión de Estado

### Hover Cross-Grid
```typescript
// Estado compartido entre todas las filas
const [hoveredProject, setHoveredProject] = useState<string | null>(null);

// Se pasa a todos los componentes
<OptimizedProjectItem hoveredProject={hoveredProject} setHoveredProject={setHoveredProject} />
```

### Efectos de Hover
- **Números**: No cambian (siempre visibles)
- **Imágenes**: Muestran overlays de video/imagen
- **Títulos**: Cambian de `opacity-0` a `opacity-100`

## Performance Optimizations

### Lazy Loading
- **Desktop**: Threshold de 100px para activar preload
- **Mobile**: Sin lazy loading (threshold 0)
- **Preload**: Solo proyectos después del índice 6

### Asset Preloading
```typescript
// Solo en desktop, solo primeros 6 proyectos
const { preloadProjectAsync } = useAssetPreloader({ 
  projects: works, 
  preloadCount: 6,
  isMobile: isMobile || false
});
```

### Conditional Rendering
- **Mobile**: Renderiza números/títulos en `OptimizedProjectItem`
- **Desktop**: Renderiza números/títulos en contenedor unificado de `WorksGrid`
- **skipContainer**: Evita contenedores anidados en desktop

## Troubleshooting: Solución Implementada

### Si las imágenes portrait no se ven más estrechas:
1. ✅ **Verificar que `imageOrientation` se esté pasando correctamente**
   ```jsx
   <OptimizedProjectItem
     // ... otros props
     imageOrientation={orientation} // Debe estar presente
   />
   ```

2. ✅ **Confirmar que `skipContainer={true}` esté activo en desktop**
   ```jsx
   <OptimizedProjectItem
     // ... otros props
     skipContainer={true} // Debe ser true en desktop
   />
   ```

3. ✅ **Revisar que `getImageClasses()` se esté aplicando**
   ```jsx
   <div className={`relative ${getImageClasses()}`}>
     {/* Contenido de imagen/video */}
   </div>
   ```

4. ✅ **Inspeccionar con DevTools las clases aplicadas**
   - Portrait: `w-1/2 mx-auto`
   - Square: `w-4/5 mx-auto` (actualizado de w-5/6)
   - Landscape: `w-full`

### Si números/títulos siguen muy lejos:
1. ✅ **Verificar que se cambió de `-top-5` a `-top-2`**
   ```jsx
   <div className="absolute -top-2 left-0 w-full flex justify-center z-30"> {/* ✅ Correcto */}
   ```

2. ✅ **Confirmar que se cambió de `-bottom-5` a `-bottom-2`**
   ```jsx
   <div className="absolute -bottom-2 left-0 w-full flex justify-center"> {/* ✅ Correcto */}
   ```

3. ✅ **Considerar usar `-top-1` y `-bottom-1` si necesitas más proximidad**

### Si los números no se alinean con las imágenes:
1. ✅ **Verificar que el contenedor del número use `flex justify-center`**
   ```jsx
   <div className="absolute -top-2 left-0 w-full flex justify-center z-30">
   ```

2. ✅ **Confirmar que el ancho interno coincida con la orientación + `justify-end`**
   ```jsx
   <div className={`${
     orientation === 'portrait' ? 'w-full flex justify-end' : 
     orientation === 'landscape' ? 'w-full flex justify-end' : 'w-5/6 flex justify-end'
   }`}>
   ```

3. ✅ **Verificar que la orientación se esté detectando correctamente**
   - Portrait: `w-full flex justify-end` (alineado con contenedor)
   - Square: `w-5/6 flex justify-end` (alineado con imagen cuadrada)
   - Landscape: `w-full flex justify-end` (alineado con imagen ancha)

### Si los títulos no se alinean con las imágenes:
1. ✅ **Verificar que el contenedor del título use `flex justify-center`**
   ```jsx
   <div className="absolute -bottom-2 left-0 w-full flex justify-center">
   ```

2. ✅ **Confirmar que el ancho interno coincida con la orientación**
   ```jsx
   <div className={`${
     orientation === 'portrait' ? 'w-1/2' : 
     orientation === 'landscape' ? 'w-full' : 'w-5/6'
   }`}>
   ```

3. ✅ **Verificar que la orientación se esté detectando correctamente**
   - Portrait: `w-1/2` (50%)
   - Square: `w-5/6` (83%)
   - Landscape: `w-full` (100%)

### Si el grid se desalinea:
1. ✅ **NO cambiar el ancho del contenedor principal**
   ```jsx
   <div className="relative w-full max-w-[400px]"> {/* ✅ Mantener fijo */}
   ```

2. ✅ **Verificar que todos usen `w-full max-w-[400px]`**

3. ✅ **Asegurar que el espacio negativo sea interno al contenedor**
   - Las clases `w-1/2`, `w-5/6` se aplican dentro del contenedor fijo
   - No afectan la alineación del grid

### Verificación de Implementación
```jsx
// ✅ Código final implementado en WorksGrid.tsx
{projectsInRow.map((project, index) => {
  const globalIndex = startIndex + index;
  const projectNumber = project.archiveOrder 
    ? project.archiveOrder.toString().padStart(2, '0') 
    : (globalIndex + 1).toString().padStart(2, '0');
  
  const orientation = getImageOrientation(project);
  
  return (
    <div key={project.id} className="flex justify-center">
      <div className="relative w-full max-w-[400px]"> {/* ✅ Ancho fijo */}
        
        {/* Número - alineado con el borde derecho de la imagen (excepto portrait) */}
        <div className="absolute -top-0.5 left-0 w-full flex justify-center z-30"> {/* ✅ -top-0.5 + flex */}
          <div className={`${ /* ✅ Ancho condicional + justify-end */
            orientation === 'portrait' ? 'w-full flex justify-end' : 
            orientation === 'landscape' ? 'w-full flex justify-end' : 'w-5/6 flex justify-end'
          }`}>
            <span className="font-normal text-foreground text-[9px]">
              {projectNumber}
            </span>
          </div>
        </div>
        
        {/* Imagen con orientación */}
        <div className="flex items-center justify-center h-[300px]"> {/* ✅ Altura fija */}
          <OptimizedProjectItem
            project={project}
            imageOrientation={orientation} {/* ✅ Nueva prop */}
            skipContainer={true} {/* ✅ Skip container */}
            // ... otros props
          />
        </div>
        
        {/* Título - alineado con el borde izquierdo de la imagen */}
        <div className="absolute -bottom-0.5 left-0 w-full flex justify-center"> {/* ✅ -bottom-0.5 + flex */}
          <div className={`${ /* ✅ Ancho condicional */
            orientation === 'portrait' ? 'w-1/2' : 
            orientation === 'landscape' ? 'w-full' : 'w-5/6'
          }`}>
            <p className="...">
              {project.title}, {project.artist}
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
})}
```

## Estilos y Spacing

### Contenedores Consistentes
```css
/* Todos los contenedores usan el mismo ancho */
.w-3/4.max-w-[240px] {
  width: 75%;
  max-width: 240px;
}
```

### Spacing Vertical
```css
/* Números - Dinámico según orientación */
.-top-2 { top: -0.5rem; }   /* Portrait y Square */
.-top-3 { top: -0.75rem; }  /* Landscape */

/* Títulos - Dinámico según orientación */
.-bottom-2 { bottom: -0.5rem; }   /* Portrait y Square */
.-bottom-3 { bottom: -0.75rem; }  /* Landscape */

/* Contenedores de imagen - Dinámicos según orientación */
.h-\[240px\] { height: 240px; }  /* Landscape */
.h-\[300px\] { height: 300px; }  /* Square */
.h-\[350px\] { height: 350px; }  /* Portrait */

/* Filas */
.mb-16 { margin-bottom: 4rem; }

/* Grid - Separación entre columnas */
.gap-12 { gap: 3rem; }
```

### Configuración por Orientación

| Tipo | Ancho | Max-Width | Altura | Número | Título |
|------|-------|-----------|--------|--------|--------|
| **Portrait** | `w-1/2` | `160px` | `350px` | `-top-2` | `-bottom-2` |
| **Landscape** | `w-full` | `280px` | `240px` | `-top-3` | `-bottom-3` |
| **Square** | `w-2/3` | `200px` | `300px` | `-top-2` | `-bottom-2` |

### Z-Index Management
```css
/* Números y títulos */
.z-30 { z-index: 30; }

/* Overlays de video/imagen */
.z-10, .z-20 { z-index: 10, 20; }
```

## Responsive Behavior

### Mobile/Tablet (< 1024px)
- Stack vertical simple
- Números y títulos renderizados por `OptimizedProjectItem`
- Sin lazy loading
- Sin preload de assets

### Desktop (≥ 1024px)
- Grid de 4 columnas con contenedor unificado por proyecto
- Números y títulos posicionados absolutamente respecto a la imagen
- Imágenes centradas verticalmente en contenedores de altura fija (300px)
- Lazy loading activado
- Preload de assets críticos
- `skipContainer={true}` para evitar contenedores anidados

## Troubleshooting

### Problemas Comunes

#### Títulos Desalineados
- **Causa**: Contenedores con anchos diferentes o posicionamiento incorrecto
- **Solución**: Verificar que usen `absolute -bottom-5 left-0 w-full`

#### Números Desalineados
- **Causa**: Posicionamiento incorrecto o z-index
- **Solución**: Verificar que usen `absolute -top-5 right-0 z-30`

#### Hover No Funciona
- **Causa**: Estado `hoveredProject` no se pasa correctamente
- **Solución**: Verificar que se pase a todos los componentes

#### Contenedores Anidados
- **Causa**: `OptimizedProjectItem` con su propio contenedor `w-3/4`
- **Solución**: Usar `skipContainer={true}` en desktop

#### Imágenes No Centradas
- **Causa**: Falta el contenedor intermedio con `items-center`
- **Solución**: Verificar que la imagen esté dentro de `<div className="flex items-center justify-center h-[300px]">`

### Debug Steps
1. Verificar que `skipContainer={true}` esté configurado en desktop
2. Confirmar que el contenedor unificado use `w-3/4 max-w-[240px]`
3. Verificar que la imagen esté dentro del contenedor intermedio con `h-[300px]`
4. Comprobar que el contenedor intermedio tenga `flex items-center justify-center`
5. Verificar que el grid use `gap-12` para separación entre columnas
6. Confirmar que las filas usen `mb-16` para separación entre filas
7. Verificar que el estado `hoveredProject` se pase correctamente
8. Revisar que los z-index estén en el orden correcto
9. Comprobar que los posicionamientos absolutos sean correctos

## Consideraciones de Accesibilidad

### Links
```jsx
<Link
  href={`/work/${generateSemanticSlug(project.title, project.artist)}`}
  aria-label={`Ver ${project.title} by ${project.artist}`}
  onMouseEnter={handleMouseEnterProject}
  onMouseLeave={handleMouseLeaveProject}
>
```

### Keyboard Navigation
- Todos los proyectos son navegables por teclado
- Focus states manejados por Tailwind CSS
- ARIA labels descriptivos

### Screen Readers
- Títulos y números tienen texto descriptivo
- Imágenes tienen alt text apropiado
- Estructura semántica clara

## Mantenimiento

### Agregar Nuevos Proyectos
- Los proyectos se agregan automáticamente al grid
- No se requieren cambios en el código
- El sistema maneja filas incompletas automáticamente

### Modificar Spacing
- Cambiar `-top-2`/`-top-3` para números (distancia desde la imagen)
- Cambiar `-bottom-2`/`-bottom-3` para títulos (distancia desde la imagen)
- Cambiar `h-[240px]`/`h-[300px]`/`h-[350px]` para altura del contenedor de imagen
- Cambiar `mb-16` para spacing entre filas (actualmente 4rem)
- Cambiar `gap-12` para spacing entre columnas (actualmente 3rem)

### Modificar Configuración por Orientación
- **Portrait**: Ajustar `w-1/2 max-w-[160px]` y `h-[350px]`
- **Landscape**: Ajustar `w-full max-w-[280px]` y `h-[240px]`
- **Square**: Ajustar `w-2/3 max-w-[200px]` y `h-[300px]`
- **Heurísticas**: Modificar palabras clave en `getImageOrientation()` (ahora incluye 'window', 'installation', 'display', 'storefront', 'facade', 'exterior')

### Ajustar Breakpoints
- Modificar `useIsMobile(1024)` para cambiar el breakpoint
- Actualizar clases `lg:hidden` y `hidden lg:block`

## Conclusión

`WorksGrid` implementa una solución elegante para el problema de alineación en grids con elementos de diferentes alturas. El uso de un contenedor unificado por proyecto con posicionamiento absoluto permite que números y títulos se alineen perfectamente con los bordes reales de cada imagen, mientras mantiene la flexibilidad y performance necesarias para una galería de portfolio profesional.

### Ventajas del Sistema Actual:
- **Simplicidad**: Un solo contenedor por proyecto con contenedor intermedio
- **Precisión**: Alineación perfecta con bordes reales de imagen
- **Centrado Vertical**: Imágenes perfectamente centradas entre sí
- **Anchos Dinámicos**: Diferentes anchos según aspect ratio crean espacio natural
- **Proximidad Optimizada**: Números y títulos más cerca de las imágenes
- **Layout Inteligente**: Imágenes verticales más estrechas, horizontales más anchas
- **Mantenibilidad**: Código más limpio y fácil de entender
- **Performance**: Menos renders que sistemas complejos
- **Flexibilidad**: Fácil ajuste de spacing, posicionamiento y altura
