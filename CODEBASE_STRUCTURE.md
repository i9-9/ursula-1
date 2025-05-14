# 🗂️ Estructura del Código y Relación de Componentes

```plaintext
app/
├── components/
│   ├── Navbar.tsx           # Barra de navegación principal (logo, links, toggle, modal About)
│   ├── AboutModal.tsx       # Modal con información sobre Ursula, abierto desde Navbar
│   ├── WorksGrid.tsx        # Grilla de proyectos destacados ("Selected Work")
│   ├── Archive.tsx          # Sección de archivo, muestra proyectos agrupados por categoría
│   ├── FeaturedProject.tsx  # (Opcional) Destaca un proyecto en particular
│   ├── Contact.tsx          # Sección de contacto/about
│   ├── HeroMarquee.tsx      # Carrusel o marquee de imágenes/videos en el hero
│   ├── LazyVideo.tsx        # Componente para videos optimizados/lazy
│   └── ...otros componentes reutilizables
│
├── hooks/
│   └── useScrollReveal.ts   # Hook para animaciones de aparición al hacer scroll
│
├── lib/
│   └── contentful.ts        # Lógica para conectar y obtener datos del CMS (Contentful)
│
├── globals.css              # Estilos globales y variables CSS
├── animations.css           # Animaciones y transiciones personalizadas
│
├── page.tsx                 # Página principal, orquesta los componentes principales
└── ...
```

---

## 🔗 Relación entre Componentes

- **Navbar.tsx**
  - Incluye el logo, links de navegación, el toggle de tema y el botón para abrir el `AboutModal`.
  - El estado del modal se maneja aquí y se pasa como prop a `AboutModal`.

- **AboutModal.tsx**
  - Modal que muestra información sobre Ursula.
  - Se abre/cierra desde el Navbar.

- **WorksGrid.tsx**
  - Muestra una grilla de proyectos destacados.
  - Puede abrir un modal propio para mostrar detalles de un proyecto.
  - Obtiene los datos de proyectos desde el CMS (a través de `lib/contentful.ts`).

- **Archive.tsx**
  - Muestra proyectos agrupados por categoría (ej: Commercial, Live, Set Design).
  - Cada grupo y proyecto puede tener interacción (hover, modal, etc).
  - Los datos también provienen del CMS.

- **Contact.tsx**
  - Sección de contacto o información adicional sobre Ursula.

- **HeroMarquee.tsx**
  - Carrusel de imágenes/videos en la parte superior (hero).
  - Puede usar datos estáticos o del CMS.

- **LazyVideo.tsx**
  - Componente reutilizable para cargar videos de forma optimizada.

---

## 🗄️ CMS (Contentful)

- **lib/contentful.ts**
  - Contiene la lógica para conectar con Contentful y obtener los datos de proyectos, categorías, imágenes, etc.
  - Los datos obtenidos se pasan como props a los componentes como `WorksGrid`, `Archive`, etc.
  - Ejemplo de uso:
    ```ts
    import { getProjects } from '@/lib/contentful';
    const projects = await getProjects();
    ```

---

## 📝 Flujo de Datos

1. **El CMS (Contentful)** almacena los proyectos, categorías, imágenes, etc.
2. **lib/contentful.ts** obtiene los datos del CMS.
3. **page.tsx** (o el layout principal) obtiene los datos y los pasa como props a los componentes (`WorksGrid`, `Archive`, etc).
4. **Los componentes** renderizan la UI y gestionan la interacción (modales, toggles, etc).
5. **Navbar** controla el modal de About y el tema global.

---

# 🚦 Flujo de carga de proyectos desde el CMS

## 1. **Definición del modelo en Contentful**
- En Contentful tienes un modelo de "Project" (o similar) con campos como: título, año, compañía, categoría, imágenes, videos, etc.

---

## 2. **Lógica de acceso en el código: `lib/contentful.ts`**

```ts
// lib/contentful.ts
import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export async function getProjects() {
  const entries = await client.getEntries({ content_type: 'project' });
  // Mapea y normaliza los datos según lo que necesite tu frontend
  return entries.items.map(item => ({
    id: item.sys.id,
    title: item.fields.title,
    year: item.fields.year,
    company: item.fields.company,
    category: item.fields.category,
    image: item.fields.image?.fields.file.url,
    // ...otros campos
  }));
}
```

---

## 3. **Carga de datos en la página principal (`page.tsx` o similar)**

```ts
// app/page.tsx
import { getProjects } from '@/lib/contentful';

export default async function Page() {
  const projects = await getProjects();

  return (
    <>
      <WorksGrid works={projects} />
      <Archive projects={projects} />
      {/* ...otros componentes */}
    </>
  );
}
```

---

## 4. **Propagación de datos a los componentes**

- Los datos de proyectos se pasan como props a los componentes que los necesitan:

```tsx
<WorksGrid works={projects} />
<Archive projects={projects} />
```

---

## 5. **Renderizado en los componentes**

- **WorksGrid.tsx** y **Archive.tsx** reciben los proyectos y los renderizan:

```ts
// app/components/WorksGrid.tsx
export default function WorksGrid({ works }) {
  return (
    <div>
      {works.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

---

## 6. **(Opcional) Filtrado y agrupamiento**

- En `Archive.tsx`, los proyectos pueden agruparse por categoría antes de renderizarse:

```ts
const grouped = groupBy(projects, 'category');
Object.entries(grouped).map(([category, items]) => (
  <Section key={category} title={category} items={items} />
));
```

---

## 7. **Visualización final**

- El usuario ve los proyectos en la grilla, agrupados y ordenados según la lógica del frontend.

---

# 📊 Esquema Visual del Flujo

```plaintext
[Contentful CMS]
      │
      ▼
[lib/contentful.ts]  ← (getProjects)
      │
      ▼
[page.tsx / layout]
      │
 ┌────┴───────────────┬─────────────┐
 │                    │             │
▼                    ▼             ▼
WorksGrid         Archive      Otros componentes
```

---

**Resumen:**
- El CMS almacena los proyectos.
- `lib/contentful.ts` los obtiene y normaliza.
- `page.tsx` los pide y los pasa como props.
- Los componentes los renderizan y agrupan según sea necesario. 