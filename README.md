# Ursula Benavidez Portfolio

Portfolio website for Ursula Benavidez, Art Director & Set Designer.

## Tech Stack

### Frontend Framework
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **React** - UI library

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **CSS Variables** - Theme customization and dark mode

### Fonts
- **Neue Haas Grotesk** - Primary font family (Display & Text variants)
- **Adobe Fonts (Typekit)** - Font delivery

### Architecture

```
app/
├── components/         # React components
│   ├── Archive.tsx    # Archive section with filterable projects
│   ├── Contact.tsx    # Contact/About section
│   ├── FeaturedProject.tsx  # Featured project carousel
│   ├── Navbar.tsx    # Navigation bar with theme toggle
│   └── WorksGrid.tsx  # Grid of works/projects
├── globals.css        # Global styles and CSS variables
├── layout.tsx         # Root layout with theme setup
└── page.tsx          # Home page component

public/
├── images/           # Static images
│   ├── archive/     # Archive section images
│   ├── grid/        # Grid section images
│   ├── hero/        # Hero section images
│   └── logo/        # Logo files
└── videos_grid/     # Video content

```

### Key Features

1. **Theme System**
   - Light/Dark mode toggle
   - CSS variables for consistent theming
   - Persistent theme preference

2. **Responsive Design**
   - Mobile-first approach
   - Breakpoint-specific layouts
   - Touch-friendly interactions

3. **Media Handling**
   - Optimized image loading
   - Video autoplay with performance considerations
   - Lazy loading for better performance

4. **Interactive Elements**
   - Smooth animations
   - Hover effects
   - Modal interactions

5. **Navigation**
   - Sticky navbar
   - Section highlighting
   - Smooth scrolling

### Component Structure

1. **Navbar**
   - Fixed positioning
   - Theme toggle
   - Section navigation
   - Responsive menu

2. **Featured Project**
   - Infinite carousel
   - Auto-advance functionality
   - Video integration

3. **Works Grid**
   - Responsive grid layout
   - Hover tooltips
   - Modal video player

4. **Archive**
   - Filterable project list
   - Category organization
   - Animated transitions

5. **Contact/About**
   - Contact information
   - Social links
   - Logo integration

### Performance Considerations

- Image optimization using Next.js Image component
- Video lazy loading
- CSS optimization with Tailwind
- Component-level code splitting
- Responsive image loading

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for all screen sizes
- Touch device support

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Setup

Required environment variables:
```env
NEXT_PUBLIC_SITE_URL=your-site-url
```

### Deployment

The site is configured for deployment on Vercel, taking advantage of:
- Edge Functions
- Image Optimization
- Automatic HTTPS
- Global CDN

### Future Improvements

1. **Performance**
   - Implement image lazy loading
   - Add video compression
   - Optimize bundle size

2. **Features**
   - Add search functionality
   - Implement filtering in WorksGrid
   - Add animations between page transitions

3. **SEO**
   - Add meta tags
   - Implement sitemap
   - Add structured data

4. **Accessibility**
   - Improve keyboard navigation
   - Add ARIA labels
   - Enhance screen reader support
