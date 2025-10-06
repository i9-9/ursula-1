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

  // Webpack configuration - CONDITIONAL: Only apply when NOT using Turbopack
  webpack: (config, { dev, isServer }) => {
    // Skip webpack config when using Turbopack in development
    if (dev && process.env.TURBOPACK) {
      return config;
    }
    
    if (!dev && !isServer) {
      // Optimize chunk splitting for production
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Create a vendor chunk for node_modules
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: 20,
          },
          // Create a common chunk for shared code
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }
    
    // Configuración para mejorar la hidratación
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
  
  // Headers para mejor rendimiento en SSG con cache busting
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // Assets estáticos con hash
          },
        ],
      },
      {
        source: '/:path*\\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate', // 24 horas para assets con versionado
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate', // Sin caché para HTML
          },
        ],
      },
    ];
  },
};

export default nextConfig;