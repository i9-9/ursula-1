'use client';

import Link from 'next/link';

const Contact = () => {
  return (
    <section id="contact" className="py-16 md:py-20 px-5 md:px-[30px] mt-12">
      <div className="mb-10">
        <h2 className="h2 tracking-wide text-hover section-title section-title-delay-3">CONTACT</h2>
      </div>
      
      <div className="space-y-12">
        <div className="archive-section">
          <h3 className="h4 font-medium mb-8 tracking-wide text-hover section-title section-title-delay-4">GET IN TOUCH</h3>
          
          {/* Header for desktop */}
          <div className="hidden md:grid md:grid-cols-[2fr_0.5fr_1.5fr] mb-3 text-xs opacity-60">
            <div>TYPE</div>
            <div className="text-right"></div>
            <div className="text-right">DETAILS</div>
          </div>
          
          {/* Header for mobile */}
          <div className="md:hidden mb-3 text-xs opacity-60">
            <div>CONTACT DETAILS</div>
          </div>
          
          <div className="space-y-0">
            <div 
                className="group hover:bg-black/5 transition-colors duration-200 -mx-2 px-2 py-1.5 mb-0.5 relative"
              >
              {/* Desktop layout (3 columns) */}
              <div className="hidden md:grid md:grid-cols-[2fr_0.5fr_1.5fr] items-start">
                <div className="pr-4 whitespace-nowrap overflow-visible text-p">Email</div>
                <div className="text-right whitespace-nowrap text-p"></div>
                <div className="text-right whitespace-nowrap overflow-visible text-p">
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
              {/* Desktop layout (3 columns) */}
              <div className="hidden md:grid md:grid-cols-[2fr_0.5fr_1.5fr] items-start">
                <div className="pr-4 whitespace-nowrap overflow-visible text-p">Phone</div>
                <div className="text-right whitespace-nowrap text-p"></div>
                <div className="text-right whitespace-nowrap overflow-visible text-p">
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
          <h3 className="h4 font-medium mb-8 tracking-wide text-hover section-title section-title-delay-5">FOLLOW</h3>
          
          {/* Header for desktop */}
          <div className="hidden md:grid md:grid-cols-[2fr_0.5fr_1.5fr] mb-3 text-xs opacity-60">
            <div>PLATFORM</div>
            <div className="text-right"></div>
            <div className="text-right">LINK</div>
          </div>
          
          {/* Header for mobile */}
          <div className="md:hidden mb-3 text-xs opacity-60">
            <div>SOCIAL MEDIA</div>
          </div>
          
          <div className="space-y-0">
            <div 
                className="group hover:bg-black/5 transition-colors duration-200 -mx-2 px-2 py-1.5 mb-0.5 relative"
              >
              {/* Desktop layout (3 columns) */}
              <div className="hidden md:grid md:grid-cols-[2fr_0.5fr_1.5fr] items-start">
                <div className="pr-4 whitespace-nowrap overflow-visible text-p">Instagram</div>
                <div className="text-right whitespace-nowrap text-p"></div>
                <div className="text-right whitespace-nowrap overflow-visible text-p">
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
              {/* Desktop layout (3 columns) */}
              <div className="hidden md:grid md:grid-cols-[2fr_0.5fr_1.5fr] items-start">
                <div className="pr-4 whitespace-nowrap overflow-visible text-p">Vimeo</div>
                <div className="text-right whitespace-nowrap text-p"></div>
                <div className="text-right whitespace-nowrap overflow-visible text-p">
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
      
      <div className="mt-20 pt-8 border-t border-foreground/10 text-sm opacity-60 flex flex-row justify-between items-center">
        <p className="text-xs md:text-sm">© {new Date().getFullYear()}</p>
        <Link href="/privacy" className="text-xs md:text-sm hover:opacity-100 transition-opacity">
          Privacy
        </Link>
      </div>
    </section>
  );
};

export default Contact; 