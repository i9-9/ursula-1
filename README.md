# Ursula Benavidez - Sitio Web Portfolio

Este repositorio contiene el código fuente del sitio web portfolio para Ursula Benavidez, art director y set designer.

## Stack Tecnológico

El sitio está construido utilizando las siguientes tecnologías:

- **Framework Principal**: [Next.js 14](https://nextjs.org/) (React Framework)
- **Lenguaje de Programación**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: 
  - [TailwindCSS 4](https://tailwindcss.com/) para utilidades de CSS
  - CSS Modules para estilos específicos de componentes
  - Variables CSS nativas para temas y consistencia
- **Animaciones**: 
  - [Framer Motion](https://www.framer.com/motion/) para animaciones complejas
  - CSS Animations para transiciones simples
- **Gestión de Contenido**: [Contentful](https://www.contentful.com/) como headless CMS
- **Tipografía**: 
  - Neue Haas Grotesk Display
  - Neue Haas Grotesk Text

## Arquitectura del Proyecto

El proyecto sigue la estructura de App Router de Next.js 14:

```
ursula-1/
├── app/
│   ├── components/       # Componentes React reutilizables
│   ├── hooks/            # Custom React hooks
│   ├── animations.css    # Animaciones globales CSS
│   ├── globals.css       # Estilos globales CSS
│   ├── spacing.css       # Utilidades de espaciado
│   ├── layout.tsx        # Layout principal de la aplicación
│   ├── page.tsx          # Página principal
│   ├── fonts.ts          # Configuración de fuentes
│   └── sitemap.ts        # Generación de sitemap
├── lib/
│   └── contentful.ts     # Integración con Contentful API
├── public/               # Archivos estáticos (videos, imágenes)
├── middleware.ts         # Middleware de Next.js
├── tailwind.config.ts    # Configuración de Tailwind CSS
└── package.json          # Dependencias y scripts
```

## Características Principales

### Sistema de Tema Dark/Light

El sitio implementa un sistema de cambio de tema (claro/oscuro) que:
- Respeta la preferencia inicial del sistema del usuario
- Permite cambio manual a través del toggle en la barra de navegación
- Persiste la selección del usuario en localStorage
- Utiliza un MutationObserver para detectar cambios en el tema y actualizar la UI en tiempo real

### Diseño Responsive

El sitio está completamente optimizado para dispositivos móviles, tablets y desktops con:
- Diseño fluido basado en grid
- Tipografía responsive
- Componentes adaptados para cada viewport
- Navegación optimizada para dispositivos táctiles

### Componentes Destacados

#### WorksGrid

Presenta los proyectos en una cuadrícula responsive con:
- Video previews para cada proyecto
- Tooltip personalizado al hacer hover
- Modal detallado al hacer clic
- Optimización para diferentes dispositivos

#### Navbar

Barra de navegación sticky con:
- Links a secciones principales
- Toggle para tema claro/oscuro
- Indicador de sección activa

#### HeroMarquee

Hero section con:
- Texto en marquee infinito
- Animaciones de scroll
- Adaptabilidad responsive

#### Archive

Sección de archivo con:
- Filtros por categoría
- Ordenamiento personalizado
- Visualización de proyectos en formato lista

## Optimizaciones de Rendimiento

- Carga lazy de videos y contenido multimedia
- Imágenes optimizadas para cada viewport
- Animaciones optimizadas para no afectar el rendimiento
- Prefetch de contenido para navegación instantánea
- CSS mínimo con enfoque utility-first de Tailwind

## Sistema de Animaciones

El sistema de animaciones implementa:
- Animaciones de scroll reveal
- Transiciones entre estados
- Animaciones de hover
- Fades y slides para elementos que entran en viewport
- Animaciones específicas de componentes

## Integración con Contentful

El sitio se conecta a Contentful para administrar dinámicamente:
- Proyectos del portfolio
- Información de contacto
- Metadatos SEO
- Categorías y filtros

## Solución de Problemas Comunes

### Manejo de Temas

El sistema de temas puede tener comportamiento inesperado con ciertos componentes. Si hay problemas con la visualización de elementos en light/dark mode:

1. Verificar que el componente use `var(--background)` y `var(--foreground)` para colores
2. Para componentes con animaciones complejas, usar `isDarkMode` con un observer
3. Evitar mezclar clases `modal-content` con componentes temáticos

### Videos y Media

Para el manejo de videos:
1. Usar siempre atributos `muted`, `playsInline` y `preload="metadata"`
2. Para mejores resultados en mobile, usar video en formato MP4 optimizado
3. Implementar lazy loading para mejorar el rendimiento inicial

## Despliegue

El sitio está desplegado en Vercel, aprovechando:
- Integración continua con GitHub
- Generación estática con ISR (Incremental Static Regeneration)
- CDN global para distribución de assets

## Futuras Mejoras

Algunas mejoras planificadas para futuras versiones:
- Implementación de animaciones GSAP para efectos más complejos
- Integración con analytics para tracking de interacciones
- Optimización adicional de assets multimedia
- Implementación de modo galería para visualización de proyectos

## Guía de Contribución

Para contribuir al proyecto:
1. Hacer fork del repositorio
2. Crear una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Hacer commit de tus cambios (`git commit -m 'Add: amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abrir un Pull Request

## Licencia

Este proyecto es propiedad intelectual de Ursula Benavidez. Todos los derechos reservados.
