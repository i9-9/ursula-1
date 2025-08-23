/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para SSG (Static Site Generation)
  // output: 'export', // Comentado para desarrollo
  trailingSlash: false,
  
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
  },

  // Webpack configuration to prevent chunk loading issues
  webpack: (config, { dev, isServer }) => {
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
    return config;
  },
  
  // Headers para mejor rendimiento en SSG
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // Cache por 1 año
          },
        ],
      },
    ];
  },
};

export default nextConfig;
