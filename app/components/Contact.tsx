'use client';

import Link from 'next/link';

const Contact = () => {
  return (
    <>
      <section id="contact" className="py-12 md:py-16 px-5 md:px-[30px]" style={{ zIndex: 1 }}>
        <div className="mb-10">
          <h2 className="h2 tracking-wide section-title section-title-delay-3">CONTACT</h2>
        </div>
        
        <div className="space-y-12">
          <div className="archive-section">
            <h3 className="text-p font-medium mb-8 tracking-wide section-title section-title-delay-4">GET IN TOUCH</h3>
            
            {/* Header for desktop */}
            <div className="hidden md:grid md:grid-cols-12 mb-3 text-xs opacity-60">
              <div className="col-span-6">TYPE</div>
              <div className="col-start-7 col-span-6 text-left">DETAILS</div>
            </div>
            
            {/* Header for mobile */}
            <div className="md:hidden mb-3 text-xs opacity-60">
              <div>CONTACT DETAILS</div>
            </div>
            
            <div className="space-y-0">
              <div 
                  className="group hover:bg-black/5 transition-colors duration-200 -mx-2 px-2 py-1.5 mb-0.5 relative"
                >
                {/* Desktop layout */}
                <div className="hidden md:grid md:grid-cols-12 items-start">
                  <div className="col-span-6 pr-4 whitespace-nowrap overflow-visible text-p">Email</div>
                  <div className="col-start-7 col-span-6 text-left whitespace-nowrap overflow-visible text-p">
                    <a 
                      href="mailto:contact@ursulabenavides.com" 
                      className="text-foreground hover:opacity-70 transition-opacity"
                    >
                      contact@ursulabenavides.com
                    </a>
                  </div>
                </div>
                
                {/* Mobile layout */}
                <div className="md:hidden">
                  <div className="flex flex-col">
                    <div className="font-medium text-p mb-1">Email</div>
                    <div className="text-sm">
                      <a 
                        href="mailto:contact@ursulabenavides.com" 
                        className="text-foreground hover:opacity-70 transition-opacity"
                      >
                        contact@ursulabenavides.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div 
                  className="group hover:bg-black/5 transition-colors duration-200 -mx-2 px-2 py-1.5 mb-0.5 relative"
                >
                {/* Desktop layout */}
                <div className="hidden md:grid md:grid-cols-12 items-start">
                  <div className="col-span-6 pr-4 whitespace-nowrap overflow-visible text-p">Phone</div>
                  <div className="col-start-7 col-span-6 text-left whitespace-nowrap overflow-visible text-p">
                    <a 
                      href="tel:+341234567890" 
                      className="text-foreground hover:opacity-70 transition-opacity"
                    >
                      +34 123 456 7890
                    </a>
                  </div>
                </div>
                
                {/* Mobile layout */}
                <div className="md:hidden">
                  <div className="flex flex-col">
                    <div className="font-medium text-p mb-1">Phone</div>
                    <div className="text-sm">
                      <a 
                        href="tel:+341234567890" 
                        className="text-foreground hover:opacity-70 transition-opacity"
                      >
                        +34 123 456 7890
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="archive-section">
            <h3 className="text-p font-medium mb-8 tracking-wide section-title section-title-delay-5">FOLLOW</h3>
            
            {/* Header for desktop */}
            <div className="hidden md:grid md:grid-cols-12 mb-3 text-xs opacity-60">
              <div className="col-span-6">PLATFORM</div>
              <div className="col-start-7 col-span-6 text-left">LINK</div>
            </div>
            
            {/* Header for mobile */}
            <div className="md:hidden mb-3 text-xs opacity-60">
              <div>SOCIAL MEDIA</div>
            </div>
            
            <div className="space-y-0">
              <div 
                  className="group hover:bg-black/5 transition-colors duration-200 -mx-2 px-2 py-1.5 mb-0.5 relative"
                >
                {/* Desktop layout */}
                <div className="hidden md:grid md:grid-cols-12 items-start">
                  <div className="col-span-6 pr-4 whitespace-nowrap overflow-visible text-p">Instagram</div>
                  <div className="col-start-7 col-span-6 text-left whitespace-nowrap overflow-visible text-p">
                    <a 
                      href="https://instagram.com/ursulabenavidez" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-foreground hover:opacity-70 transition-opacity"
                    >
                      @ursulabenavidez
                    </a>
                  </div>
                </div>
                
                {/* Mobile layout */}
                <div className="md:hidden">
                  <div className="flex flex-col">
                    <div className="font-medium text-p mb-1">Instagram</div>
                    <div className="text-sm">
                      <a 
                        href="https://instagram.com/ursulabenavidez" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-foreground hover:opacity-70 transition-opacity"
                      >
                        @ursulabenavidez
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div 
                  className="group hover:bg-black/5 transition-colors duration-200 -mx-2 px-2 py-1.5 mb-0.5 relative"
                >
                {/* Desktop layout */}
                <div className="hidden md:grid md:grid-cols-12 items-start">
                  <div className="col-span-6 pr-4 whitespace-nowrap overflow-visible text-p">Vimeo</div>
                  <div className="col-start-7 col-span-6 text-left whitespace-nowrap overflow-visible text-p">
                    <a 
                      href="https://vimeo.com/ursulabenavidez" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-foreground hover:opacity-70 transition-opacity"
                    >
                      vimeo.com/ursulabenavidez
                    </a>
                  </div>
                </div>
                
                {/* Mobile layout */}
                <div className="md:hidden">
                  <div className="flex flex-col">
                    <div className="font-medium text-p mb-1">Vimeo</div>
                    <div className="text-sm">
                      <a 
                        href="https://vimeo.com/ursulabenavidez" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-foreground hover:opacity-70 transition-opacity"
                      >
                        vimeo.com/ursulabenavidez
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="py-4 md:py-6 px-5 md:px-[30px]">
        <div className="mt-4 pt-1 text-sm opacity-60 grid grid-cols-12 items-center">
          <p className="text-xs md:text-sm col-span-6">© {new Date().getFullYear()}</p>
          <Link href="/privacy" className="text-xs md:text-sm hover:opacity-100 transition-opacity col-start-10 col-span-3 text-left">
            Privacy
          </Link>
        </div>
      </footer>
    </>
  );
};

export default Contact; 