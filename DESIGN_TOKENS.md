# 🎨 Design Tokens - Ursula Benavidez Portfolio

## 📋 Table of Contents
1. [Color System](#color-system)
2. [Typography](#typography)
3. [Spacing System](#spacing-system)
4. [Breakpoints](#breakpoints)
5. [Animation & Transitions](#animation--transitions)
6. [Component Tokens](#component-tokens)
7. [Usage Guidelines](#usage-guidelines)

---

## 🎨 Color System

### Base Colors
```css
/* Light Theme */
--background: #FAFAFA;     /* Light gray background */
--foreground: #252525;     /* Dark gray text */

/* Dark Theme */
--background: #252525;     /* Dark gray background */
--foreground: #FAFAFA;     /* Light gray text */
```

### Semantic Colors
```css
/* Contentful Integration Colors */
--border: #e4e4e7;         /* Light border color */
--ring: #020817;           /* Focus ring color */
--primary: #0A0A0A;        /* Primary brand color */
--primary-foreground: #fefefe;
--secondary: #f1f5f9;      /* Secondary background */
--secondary-foreground: #0f172a;
--accent: #f1f5f9;         /* Accent color */
--accent-foreground: #0f172a;
--destructive: #ef4444;    /* Error/delete color */
--destructive-foreground: #fefefe;
--muted: #f1f5f9;          /* Muted background */
--muted-foreground: #64748b;
--card: #fefefe;           /* Card background */
--card-foreground: #0A0A0A;
--popover: #fefefe;        /* Popover background */
--popover-foreground: #0A0A0A;
```

### Opacity Variants
```css
/* Common opacity values used throughout */
--foreground/5: rgba(37, 37, 37, 0.05);   /* Very subtle overlay */
--foreground/10: rgba(37, 37, 37, 0.1);   /* Subtle border */
--foreground/20: rgba(37, 37, 37, 0.2);   /* Light overlay */
--foreground/60: rgba(37, 37, 37, 0.6);   /* Medium text */
--foreground/80: rgba(37, 37, 37, 0.8);   /* Strong text */
--black/5: rgba(0, 0, 0, 0.05);           /* Very light overlay */
--black/80: rgba(0, 0, 0, 0.8);           /* Dark overlay */
--white/20: rgba(255, 255, 255, 0.2);     /* Light border on dark */
```

---

## 📝 Typography

### Font Families
```css
/* Primary Fonts */
--font-suisse: 'Suisse BP INTL', system-ui, -apple-system, sans-serif;
--font-display: 'neue-haas-grotesk-display', system-ui, sans-serif;
--font-text: 'neue-haas-grotesk-text', system-ui, sans-serif;

/* Font Weights */
--font-weight-regular: 400;    /* Roman */
--font-weight-medium: 500;     /* Medium */
--font-weight-bold: 700;       /* Bold */
```

### Responsive Typography Scale
```css
/* Mobile First Typography (Base: 11px) */
--font-size-h1: clamp(1.125rem, 0.9318rem + 0.9659vw, 1.636rem);   /* 18px → 26px */
--font-size-h2: clamp(0.875rem, 0.7784rem + 0.4829vw, 1.182rem);   /* 14px → 19px */
--font-size-h3: clamp(0.875rem, 0.7784rem + 0.4829vw, 1.182rem);   /* 14px → 19px */
--font-size-h4: clamp(0.8125rem, 0.7443rem + 0.3409vw, 1.091rem);  /* 13px → 17px */
--font-size-h5: clamp(0.75rem, 0.7045rem + 0.2273vw, 1rem);        /* 12px → 16px */
--font-size-h6: clamp(0.6875rem, 0.6534rem + 0.1705vw, 0.909rem);  /* 11px → 15px */
--font-size-p: clamp(0.75rem, 0.7045rem + 0.2273vw, 0.909rem);     /* 12px → 15px */
--font-size-small: clamp(0.6875rem, 0.6534rem + 0.1705vw, 0.818rem); /* 11px → 13px */
--font-size-xs: clamp(0.625rem, 0.6023rem + 0.1136vw, 0.727rem);   /* 10px → 12px */
```

### Line Heights
```css
--line-height-tight: 1.2;      /* Headings */
--line-height-normal: 1.4;     /* Body text */
--line-height-relaxed: 1.5;    /* Paragraphs */
```

### Typography Classes
```css
/* Heading Classes */
.h1, h1 { font-size: var(--font-size-h1); font-weight: 500; line-height: 1.2; }
.h2, h2 { font-size: var(--font-size-h2); font-weight: 500; line-height: 1.3; }
.h3, h3 { font-size: var(--font-size-h3); font-weight: 500; line-height: 1.3; }
.h4, h4 { font-size: var(--font-size-h4); font-weight: 500; line-height: 1.4; }
.h5, h5 { font-size: var(--font-size-h5); font-weight: 500; line-height: 1.4; }
.h6, h6 { font-size: var(--font-size-h6); font-weight: 500; line-height: 1.4; }

/* Text Classes */
.text-p { font-size: var(--font-size-p); font-weight: 400; line-height: 1.5; }
.text-small { font-size: var(--font-size-small); font-weight: 400; }
.text-xs { font-size: var(--font-size-xs); font-weight: 400; }
```

---

## 📏 Spacing System

### Base Spacing Scale
```css
/* 8px Base Grid System */
--space-xs: 0.125rem;   /* 2px */
--space-sm: 0.25rem;    /* 4px */
--space-md: 0.375rem;   /* 6px */
--space-lg: 0.5rem;     /* 8px */
--space-xl: 0.75rem;    /* 12px */
--space-2xl: 1.25rem;   /* 20px */
```

### Margin Utilities
```css
/* Top Margins */
.mt-xs { margin-top: var(--space-xs); }
.mt-sm { margin-top: var(--space-sm); }
.mt-md { margin-top: var(--space-md); }
.mt-lg { margin-top: var(--space-lg); }
.mt-xl { margin-top: var(--space-xl); }
.mt-2xl { margin-top: var(--space-2xl); }

/* Bottom Margins */
.mb-xs { margin-bottom: var(--space-xs); }
.mb-sm { margin-bottom: var(--space-sm); }
.mb-md { margin-bottom: var(--space-md); }
.mb-lg { margin-bottom: var(--space-lg); }
.mb-xl { margin-bottom: var(--space-xl); }
.mb-2xl { margin-bottom: var(--space-2xl); }

/* Vertical Margins */
.my-xs { margin-top: var(--space-xs); margin-bottom: var(--space-xs); }
.my-sm { margin-top: var(--space-sm); margin-bottom: var(--space-sm); }
.my-md { margin-top: var(--space-md); margin-bottom: var(--space-md); }
.my-lg { margin-top: var(--space-lg); margin-bottom: var(--space-lg); }
.my-xl { margin-top: var(--space-xl); margin-bottom: var(--space-xl); }
.my-2xl { margin-top: var(--space-2xl); margin-bottom: var(--space-2xl); }
```

### Padding Utilities
```css
/* Top Padding */
.pt-xs { padding-top: var(--space-xs); }
.pt-sm { padding-top: var(--space-sm); }
.pt-md { padding-top: var(--space-md); }
.pt-lg { padding-top: var(--space-lg); }
.pt-xl { padding-top: var(--space-xl); }
.pt-2xl { padding-top: var(--space-2xl); }

/* Bottom Padding */
.pb-xs { padding-bottom: var(--space-xs); }
.pb-sm { padding-bottom: var(--space-sm); }
.pb-md { padding-bottom: var(--space-md); }
.pb-lg { padding-bottom: var(--space-lg); }
.pb-xl { padding-bottom: var(--space-xl); }
.pb-2xl { padding-bottom: var(--space-2xl); }

/* Vertical Padding */
.py-xs { padding-top: var(--space-xs); padding-bottom: var(--space-xs); }
.py-sm { padding-top: var(--space-sm); padding-bottom: var(--space-sm); }
.py-md { padding-top: var(--space-md); padding-bottom: var(--space-md); }
.py-lg { padding-top: var(--space-lg); padding-bottom: var(--space-lg); }
.py-xl { padding-top: var(--space-xl); padding-bottom: var(--space-xl); }
.py-2xl { padding-top: var(--space-2xl); padding-bottom: var(--space-2xl); }
```

---

## 📱 Breakpoints

### Responsive Breakpoints
```css
/* Tailwind CSS Breakpoints */
sm: '480px'      /* Small mobile */
md: '1024px'     /* Tablet/Desktop */
lg: '1280px'     /* Large desktop */
xl: '1536px'     /* Extra large desktop */
```

### Container Padding
```css
/* Responsive Container Padding */
px-2.5          /* 10px on mobile */
md:px-[15px]    /* 15px on desktop */
```

---

## ✨ Animation & Transitions

### Duration Tokens
```css
/* Transition Durations */
--duration-fast: 0.18s;      /* Quick interactions */
--duration-normal: 0.3s;     /* Standard transitions */
--duration-slow: 0.5s;       /* Smooth animations */
--duration-slower: 1s;       /* Long animations */
```

### Easing Functions
```css
/* Custom Easing Curves */
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);    /* Smooth out */
--ease-in-out: ease-in-out;                     /* Standard */
--ease-out-fast: ease-out;                      /* Quick out */
```

### Animation Classes
```css
/* Fade Animations */
.fade-in { animation: fadeIn 0.5s ease-in-out; }
.fade-in-slow { animation: fadeIn 1s ease-in-out; }
.fade-up { animation: fadeUp 0.5s ease-out; }

/* Hover Effects */
.hover-view::after {
  background: rgba(0, 0, 0, 0.1);
  transition: opacity 0.3s ease;
}

/* Transform Transitions */
.transition-transform { transition: transform 0.5s; }
.group-hover:scale-105 { transform: scale(1.05); }
```

### Keyframe Animations
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 🧩 Component Tokens

### Navigation
```css
/* Navbar Height */
--navbar-height: 36px;

/* Navbar States */
.navbar-scrolled { 
  background: var(--background)/90; 
  backdrop-filter: blur(12px); 
}
```

### Grid System
```css
/* 12-Column Grid */
.grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }
.col-span-12 { grid-column: span 12 / span 12; }
.md:col-span-6 { grid-column: span 6 / span 6; }
.lg:col-span-4 { grid-column: span 4 / span 4; }

/* Grid Gaps */
.gap-y-6 { row-gap: 1.5rem; }
.gap-x-6 { column-gap: 1.5rem; }
.md:gap-x-8 { column-gap: 2rem; }
```

### Modal & Overlay
```css
/* Modal Background */
.modal-bg { background: rgba(0, 0, 0, 0.8); }

/* Modal Content */
.modal-content { 
  background: var(--background); 
  border-radius: 0.5rem; 
  max-width: 90vw; 
}
```

### Video & Image
```css
/* Aspect Ratios */
.aspect-video { aspect-ratio: 16 / 9; }

/* Object Fit */
.object-cover { object-fit: cover; }
.object-contain { object-fit: contain; }

/* Video Controls */
.video-muted { filter: brightness(0.8); }
```

---

## 📋 Usage Guidelines

### Color Usage
- **Primary Text**: Use `text-foreground` for main content
- **Secondary Text**: Use `text-foreground/60` or `text-foreground/80`
- **Backgrounds**: Use `bg-background` for main backgrounds
- **Borders**: Use `border-foreground/10` for subtle borders
- **Overlays**: Use `bg-black/5` for very light overlays

### Typography Usage
- **Headings**: Use `.h1` through `.h6` classes
- **Body Text**: Use `.text-p` for paragraphs
- **Small Text**: Use `.text-small` for captions
- **Extra Small**: Use `.text-xs` for metadata

### Spacing Usage
- **Component Spacing**: Use `py-6 md:py-8` for section padding
- **Element Spacing**: Use `mb-10` for section headers
- **Grid Spacing**: Use `gap-y-6 gap-x-6 md:gap-x-8` for grids
- **Text Spacing**: Use `mb-1` for tight spacing, `mb-4` for normal

### Animation Usage
- **Hover Effects**: Use `transition-transform duration-500`
- **Page Transitions**: Use `fade-in` for page loads
- **Element Entrances**: Use `fade-up` for scroll reveals
- **Modal Animations**: Use `duration-0.18 ease-out` for quick interactions

### Responsive Design
- **Mobile First**: Start with mobile styles, then add `md:` and `lg:` prefixes
- **Typography**: Use `clamp()` for fluid typography
- **Spacing**: Use responsive padding classes
- **Grid**: Use responsive column spans

---

## 🔧 Implementation Notes

### CSS Custom Properties
All design tokens are implemented as CSS custom properties for:
- **Theme Switching**: Easy dark/light mode toggle
- **Runtime Updates**: Dynamic value changes
- **Maintainability**: Centralized token management

### Tailwind Integration
Design tokens are integrated with Tailwind CSS through:
- **Theme Extension**: Custom colors and fonts in `tailwind.config.ts`
- **Utility Classes**: Standard Tailwind utilities with custom values
- **Component Classes**: Custom CSS classes for complex components

### Performance Considerations
- **Font Loading**: Optimized with `font-display: swap`
- **CSS Size**: Minimal custom CSS with utility-first approach
- **Animation Performance**: Hardware-accelerated transforms
- **Responsive Images**: Optimized with Next.js Image component

---

*Last updated: December 2024* 