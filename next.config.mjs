/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para SSG (Static Site Generation)
  // output: 'export', // Comentado para desarrollo
  trailingSlash: false,

  // Configuración para prevenir problemas de hidratación
  reactStrictMode: true,
  // swcMinify: true, // REMOVED - This is deprecated in Next.js 13+
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'videos.ctfassets.net',
        pathname: '/**',
      },
    ],
    // Don't want to optimize video files
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Optimización para SSG
    unoptimized: false, // Mantener optimización de imágenes
  },
  
  // Configuración para build estático
  experimental: {
    // Optimizar el build para SSG
    // optimizeCss: true, // Comentado por problemas con critters
    optimizePackageImports: ['contentful'],
    // Configuración para mejorar la hidratación
    optimizeServerReact: true,
    
    // ADDED - Turbopack configuration to handle your webpack settings
    turbo: {
      rules: {
        // Add any specific loader rules here if needed
      },
    },
  },

  // Webpack configuration - Minimal, let Next.js handle chunk splitting
  webpack: (config, { isServer }) => {
    // Only apply fallbacks for client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
};

export default nextConfig;