/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para SSG en producción
  output: 'export', // Export estático completo para producción
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
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true, // Deshabilitar optimización para export estático
  },
  
  // Configuración para build estático
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['contentful'],
  },
  
  // Headers para mejor rendimiento en SSG
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
