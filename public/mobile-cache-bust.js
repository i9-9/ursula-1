
// Script específico para invalidar cache en mobile
const invalidateMobileCache = async () => {
  try {
    // Detectar si es mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      console.log('📱 Dispositivo mobile detectado - invalidando cache');
      
      // Forzar recarga de la página /work
      if (window.location.pathname.includes('/work')) {
        // Limpiar cache del navegador
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          );
          console.log('📱 Cache del navegador limpiado');
        }
        
        // Recargar página sin cache
        window.location.reload(true);
      }
    }
  } catch (error) {
    console.error('Error invalidating mobile cache:', error);
  }
};

// Ejecutar invalidación automáticamente en mobile
if (typeof window !== 'undefined') {
  invalidateMobileCache();
}
