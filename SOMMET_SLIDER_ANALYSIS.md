# Análisis Exhaustivo: Slider Sommet Studio

## 🔍 Información General

**URL**: https://sommetstudio.com/  
**Librería**: Swiper.js (https://swiperjs.com/)  
**Framework**: React (con Styled Components)  

---

## 📐 Arquitectura y Estructura

### Estructura HTML/DOM

```html
<div class="swiper swiper-initialized swiper-horizontal mySwiper">
  <div class="swiper-wrapper">
    <div class="swiper-slide swiper-slide-active">
      <div class="image-wrapper">
        <img src="..." alt="random" />
      </div>
    </div>
    <div class="swiper-slide swiper-slide-next">
      <div class="image-wrapper">
        <img src="..." alt="random" />
      </div>
    </div>
    <!-- más slides... -->
  </div>
  <div class="swiper-scrollbar"></div>
</div>
```

### Jerarquía de Componentes

```
Parent Container (display: flex, align-items: center, justify-content: center)
  └─ Swiper Container (.swiper)
      ├─ Swiper Wrapper (.swiper-wrapper)
      │   └─ Swiper Slides (.swiper-slide) × 12
      │       └─ Image Wrapper (styled-component)
      │           └─ Image/Video Element
      └─ Swiper Scrollbar (hidden, height: 0)
```

---

## ⚙️ Configuración de Swiper

### Parámetros Principales

```javascript
{
  // Visualización
  slidesPerView: 3,              // Muestra 3 slides simultáneamente
  spaceBetween: 180,             // 180px de espacio entre slides
  centeredSlides: true,          // Centra el slide activo
  
  // Transiciones
  speed: 300,                    // 300ms de duración de transición
  effect: 'slide',               // Efecto de deslizamiento estándar
  
  // Navegación
  loop: false,                   // Sin bucle infinito
  grabCursor: false,             // Sin cursor de agarre
  
  // Controles
  navigation: false,             // Sin flechas de navegación
  pagination: false,             // Sin paginación (dots)
  scrollbar: {
    enabled: true,               // Scrollbar habilitado pero oculto
    height: 0                    // Altura 0px (invisible)
  },
  
  // Mouse Wheel
  mousewheel: {
    enabled: true,               // Navegación con rueda del mouse
    releaseOnEdges: false,
    invert: false,
    forceToAxis: true,
    sensitivity: 1,
    eventsTarget: 'container'
  }
}
```

---

## 🎨 Estilos y CSS

### Container Principal

```css
.swiper {
  display: block;
  position: relative;
  overflow: hidden;
  width: 1860px;
  height: 968px;
}
```

### Parent Container (Wrapper externo)

```css
.parent-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1860px;
  height: 968px;
  padding: 0;
}
```

### Swiper Wrapper

```css
.swiper-wrapper {
  display: flex;
  transform: translate3d(680px, 0px, 0px);
  transition-duration: 0ms;
  width: 1860px;
}
```

### Slides Individuales

```css
.swiper-slide {
  width: 500px;
  margin-right: 180px;
  display: flex;
  position: relative;
  
  /* Transición suave para la escala */
  transition: 0.2s ease-in-out;
}

/* Slide Activo - CARACTERÍSTICA CLAVE */
.swiper-slide-active {
  transform: scale(1.4);
  transform-origin: 250px 624.875px; /* Centro del slide */
  transition: 0.2s ease-in-out;
}
```

### Imágenes

```css
.swiper-slide img {
  width: 500px;
  height: 624.875px;
  object-fit: fill;
  cursor: none; /* Usa cursor personalizado */
  user-select: auto;
}
```

---

## ✨ Características Especiales

### 1. Escala del Slide Activo (Efecto Principal)

El efecto más distintivo del slider es que el slide activo se escala a **1.4x**:

```css
.swiper-slide-active {
  transform: scale(1.4);
  transform-origin: center center;
  transition: transform 0.2s ease-in-out;
}
```

**Cómo funciona:**
- Cuando un slide se vuelve activo (centrado), se escala desde 1.0 → 1.4
- La transición es suave (0.2s ease-in-out)
- El origen de la transformación es el centro del slide
- Los slides laterales permanecen en escala 1.0

### 2. Cursor Personalizado

Implementación de un cursor azul personalizado:

```css
.custom-cursor {
  position: absolute;
  width: fit-content;
  height: fit-content;
  background-color: rgb(5, 51, 255); /* Azul vibrante */
  border-radius: 5px;
  pointer-events: none;
  z-index: 3;
  transition: all;
}
```

```javascript
// Implementación React (pseudo-código)
useEffect(() => {
  const handleMouseMove = (e) => {
    cursorRef.current.style.left = `${e.clientX}px`;
    cursorRef.current.style.top = `${e.clientY}px`;
  };
  
  window.addEventListener('mousemove', handleMouseMove);
  return () => window.removeEventListener('mousemove', handleMouseMove);
}, []);
```

### 3. Soporte Mixto de Media

El slider soporta tanto imágenes como videos:

```html
<!-- Imagen -->
<img 
  class="image image-0" 
  src="https://cdn.sanity.io/images/..." 
  alt="random" 
/>

<!-- Video -->
<video 
  class="image image-2 horizontal" 
  src="https://cdn.sanity.io/files/..." 
  alt="random" 
  autoplay 
  loop 
/>
```

### 4. Aspectos de Imágenes Variables

Las imágenes mantienen sus aspect ratios originales:
- Imagen 1: **0.80** (800 × 1000 aprox) - Vertical
- Imagen 2: **0.75** (750 × 1000 aprox) - Vertical
- Imagen 3: **1.23** (1230 × 1000 aprox) - Horizontal
- Imagen 4: **0.75** (750 × 1000 aprox) - Vertical

---

## 🎯 Interacciones del Usuario

### Métodos de Navegación

1. **Mouse Wheel (Principal)**
   - Deslizar hacia arriba/abajo cambia slides
   - `forceToAxis: true` - fuerza movimiento horizontal
   - Sensitivity: 1 (velocidad normal)

2. **Drag/Swipe**
   - Touch y mouse drag habilitados por defecto en Swiper
   - No usa `grabCursor`

3. **Keyboard** (si está habilitado)
   - Flechas izquierda/derecha para navegar

### Estados de los Slides

```javascript
// Estados posibles de un slide
.swiper-slide                  // Estado normal
.swiper-slide-active           // Slide activo (centrado, escala 1.4)
.swiper-slide-next             // Siguiente slide
.swiper-slide-prev             // Slide anterior
```

---

## 💻 Implementación en React

### Código Base (usando Swiper React)

```tsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/scrollbar';

const SommetSlider = () => {
  const slides = [
    { type: 'image', src: 'https://...', alt: 'Project 1' },
    { type: 'image', src: 'https://...', alt: 'Project 2' },
    { type: 'video', src: 'https://...', alt: 'Project 3' },
    // ... más slides
  ];

  return (
    <div className="slider-container">
      <Swiper
        modules={[Mousewheel, Scrollbar]}
        slidesPerView={3}
        spaceBetween={180}
        centeredSlides={true}
        speed={300}
        mousewheel={{
          enabled: true,
          forceToAxis: true,
          sensitivity: 1,
        }}
        scrollbar={{
          hide: true,
        }}
        className="mySwiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="slide-content">
              {slide.type === 'image' ? (
                <img src={slide.src} alt={slide.alt} />
              ) : (
                <video src={slide.src} autoPlay loop muted />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SommetSlider;
```

### Estilos CSS (Styled Components o CSS Module)

```css
.slider-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.mySwiper {
  width: 1860px;
  height: 968px;
  position: relative;
  overflow: hidden;
}

/* Slide base */
.swiper-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease-in-out;
}

/* Efecto de escala en slide activo - CARACTERÍSTICA PRINCIPAL */
.swiper-slide-active {
  transform: scale(1.4);
}

.slide-content {
  width: 500px;
  height: auto;
}

.slide-content img,
.slide-content video {
  width: 100%;
  height: auto;
  object-fit: cover;
  cursor: none;
}

/* Ocultar scrollbar pero mantener funcionalidad */
.swiper-scrollbar {
  display: none;
}
```

### Custom Cursor Component

```tsx
import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const handleMouseEnter = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        width: '20px',
        height: '20px',
        backgroundColor: 'rgb(5, 51, 255)',
        borderRadius: '5px',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%, -50%)',
        transition: 'opacity 0.2s',
        opacity: 0,
      }}
    />
  );
};

export default CustomCursor;
```

---

## 📱 Consideraciones Responsive

### Breakpoints Sugeridos

```javascript
// Configuración responsive para implementar
breakpoints: {
  // Mobile
  320: {
    slidesPerView: 1,
    spaceBetween: 20,
  },
  // Tablet
  768: {
    slidesPerView: 2,
    spaceBetween: 60,
  },
  // Desktop
  1024: {
    slidesPerView: 3,
    spaceBetween: 180,
  }
}
```

### Ajustes de Escala Responsive

```css
@media (max-width: 768px) {
  .swiper-slide-active {
    transform: scale(1.2); /* Menos escala en mobile */
  }
}

@media (min-width: 1024px) {
  .swiper-slide-active {
    transform: scale(1.4); /* Escala completa en desktop */
  }
}
```

---

## 🎬 Animaciones y Transiciones

### Timeline de Animación

```
Usuario desliza (mousewheel/drag)
  ↓
Swiper detecta evento (speed: 300ms)
  ↓
swiper-wrapper se traslada (translate3d)
  ↓
Clase .swiper-slide-active cambia al nuevo slide
  ↓
Transición CSS se activa (0.2s ease-in-out)
  ↓
Slide anterior: scale(1.4) → scale(1.0)
Slide nuevo: scale(1.0) → scale(1.4)
  ↓
Animación completa (520ms total aprox)
```

### Timing Functions

- **Swiper transition**: 300ms (velocidad de slide)
- **Scale transition**: 200ms ease-in-out
- **Cursor transition**: all (default, ~200ms)

---

## 🔧 Tecnologías y Dependencias

### NPM Packages

```json
{
  "dependencies": {
    "swiper": "^11.0.0",
    "react": "^18.2.0",
    "styled-components": "^6.0.0"
  }
}
```

### Instalación

```bash
npm install swiper
# o
yarn add swiper
# o
pnpm add swiper
```

---

## 📊 Datos Técnicos Medidos

### Dimensiones

| Elemento | Valor |
|----------|-------|
| Container Width | 1860px |
| Container Height | 968px |
| Slide Width | 500px |
| Space Between | 180px |
| Image Width | 500px |
| Image Height | ~625px (variable) |

### Transformaciones

| Estado | Transform |
|--------|-----------|
| Slide Normal | scale(1.0) |
| Slide Activo | scale(1.4) |
| Wrapper Translate | translate3d(680px, 0, 0) |

### Timing

| Propiedad | Duración |
|-----------|----------|
| Swiper Speed | 300ms |
| Scale Transition | 200ms |
| Ease Function | ease-in-out |

---

## 🎨 Paleta de Colores Identificada

- **Custom Cursor**: `rgb(5, 51, 255)` (#0533FF) - Azul eléctrico
- **Background**: Blanco/claro (por defecto)
- **Scrollbar**: Transparente (oculto)

---

## ⚡ Optimizaciones

### Performance Tips

1. **Use CSS Transforms** (ya implementado)
   - `transform: scale()` en lugar de width/height
   - Hardware acceleration con `translate3d()`

2. **Lazy Loading de Imágenes**
   ```javascript
   lazy: {
     loadPrevNext: true,
     loadPrevNextAmount: 2,
   }
   ```

3. **Preload Crítico**
   ```html
   <link rel="preload" as="image" href="first-slide.jpg" />
   ```

4. **Video Optimization**
   ```html
   <video preload="metadata" loop muted playsinline>
   ```

---

## 🐛 Posibles Mejoras

1. **Accesibilidad**
   - Agregar `aria-label` a slides
   - Soporte de navegación por teclado
   - Focus states visibles

2. **SEO**
   - Mejorar atributos `alt` de imágenes
   - Structured data para galería

3. **UX**
   - Indicador de progreso sutil
   - Transición más suave en cambios rápidos
   - Feedback visual en drag

---

## 📝 Notas Finales

### Puntos Clave del Diseño

1. **Minimalismo**: Sin navegación visible, solo rueda del mouse
2. **Foco en contenido**: El slide activo se agranda (1.4x)
3. **Fluuidez**: Transiciones suaves y rápidas
4. **Modernidad**: Cursor personalizado y diseño limpio

### Stack Tecnológico Detectado

- **CMS**: Sanity.io (por las URLs de imágenes)
- **Hosting**: Probablemente Vercel/Netlify
- **Librería Slider**: Swiper.js
- **Styling**: Styled Components
- **Framework**: React

---

## 🔗 Referencias

- [Swiper.js Documentation](https://swiperjs.com/react)
- [Swiper API](https://swiperjs.com/swiper-api)
- [Swiper Demos](https://swiperjs.com/demos)

---

**Análisis completado**: 29 de Septiembre, 2025  
**Sitio analizado**: https://sommetstudio.com/  
**Herramientas**: Playwright MCP Server, Chrome DevTools

