
// Script para invalidar caché en Vercel
const invalidateCache = async () => {
  try {
    const response = await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cacheBust: true,
        version: 'v20251014-1760459825433',
        timestamp: 1760459825433
      })
    });
    
    const result = await response.json();
    console.log('Cache invalidated:', result);
  } catch (error) {
    console.error('Error invalidating cache:', error);
  }
};

// Ejecutar invalidación automáticamente
if (typeof window !== 'undefined') {
  invalidateCache();
}
