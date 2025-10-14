'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollManager() {
  const pathname = usePathname()

  useEffect(() => {
    // Páginas que necesitan scroll
    const scrollPages = ['/work', '/archive']
    
    if (scrollPages.includes(pathname)) {
      // Habilitar scroll
      document.body.classList.add('allow-scroll')
    } else {
      // Deshabilitar scroll
      document.body.classList.remove('allow-scroll')
    }

    // Cleanup al desmontar
    return () => {
      document.body.classList.remove('allow-scroll')
    }
  }, [pathname])

  return null
}
