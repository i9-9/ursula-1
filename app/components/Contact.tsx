'use client';

import Link from 'next/link';

const Contact = () => {
  return (
    <section id="contact" className="py-20 px-[30px] mt-12">
      <div className="mb-10">
        <h2 className="h2 tracking-wide text-hover section-title section-title-delay-3">CONTACT</h2>
      </div>
      
      <div className="space-y-12">
        <div className="archive-section reveal reveal-delay-1">
          <h3 className="h4 font-medium mb-8 tracking-wide text-hover heading-animate">GET IN TOUCH</h3>
          
          {/* Header for desktop */}
          <div className="hidden md:grid md:grid-cols-[2fr_0.5fr_1.5fr] mb-3 text-xs opacity-60">
            <div>TYPE</div>
            <div className="text-right"></div>
            <div className="text-right">DETAILS</div>
          </div>
          
          <div className="space-y-0">
            <div className="group hover:bg-black/5 transition-colors duration-200 -mx-2 px-2 py-0 relative">
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
              <div className="md:hidden space-y-0">
                <div className="font-medium whitespace-nowrap overflow-visible text-p">Email</div>
                <div className="flex justify-between text-p opacity-80">
                  <div className="whitespace-nowrap"></div>
                  <div className="whitespace-nowrap overflow-visible">
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
            
            <div className="group hover:bg-black/5 transition-colors duration-200 -mx-2 px-2 py-0 relative">
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
              <div className="md:hidden space-y-0">
                <div className="font-medium whitespace-nowrap overflow-visible text-p">Phone</div>
                <div className="flex justify-between text-p opacity-80">
                  <div className="whitespace-nowrap"></div>
                  <div className="whitespace-nowrap overflow-visible">
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

        <div className="archive-section reveal reveal-delay-2">
          <h3 className="h4 font-medium mb-8 tracking-wide text-hover heading-animate">FOLLOW</h3>
          
          {/* Header for desktop */}
          <div className="hidden md:grid md:grid-cols-[2fr_0.5fr_1.5fr] mb-3 text-xs opacity-60">
            <div>PLATFORM</div>
            <div className="text-right"></div>
            <div className="text-right">LINK</div>
          </div>
          
          <div className="space-y-0">
            <div className="group hover:bg-black/5 transition-colors duration-200 -mx-2 px-2 py-0 relative">
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
              <div className="md:hidden space-y-0">
                <div className="font-medium whitespace-nowrap overflow-visible text-p">Instagram</div>
                <div className="flex justify-between text-p opacity-80">
                  <div className="whitespace-nowrap"></div>
                  <div className="whitespace-nowrap overflow-visible">
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
            
            <div className="group hover:bg-black/5 transition-colors duration-200 -mx-2 px-2 py-0 relative">
              {/* Desktop layout (3 columns) */}
              <div className="hidden md:grid md:grid-cols-[2fr_0.5fr_1.5fr] items-start">
                <div className="pr-4 whitespace-nowrap overflow-visible text-p">LinkedIn</div>
                <div className="text-right whitespace-nowrap text-p"></div>
                <div className="text-right whitespace-nowrap overflow-visible text-p">
                  <a 
                    href="https://linkedin.com/in/ursulabenavidez" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-foreground hover:opacity-70 transition-opacity"
                  >
                    in/ursulabenavidez
                  </a>
                </div>
              </div>
              
              {/* Mobile layout */}
              <div className="md:hidden space-y-0">
                <div className="font-medium whitespace-nowrap overflow-visible text-p">LinkedIn</div>
                <div className="flex justify-between text-p opacity-80">
                  <div className="whitespace-nowrap"></div>
                  <div className="whitespace-nowrap overflow-visible">
                    <a 
                      href="https://linkedin.com/in/ursulabenavidez" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-foreground hover:opacity-70 transition-opacity"
                    >
                      in/ursulabenavidez
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-20 pt-8 border-t border-foreground/10 text-sm opacity-60 flex justify-between items-center">
        <p>© {new Date().getFullYear()} Ursula Benavidez. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:opacity-100 transition-opacity">
            Privacy
          </Link>
          <Link href="/impressum" className="hover:opacity-100 transition-opacity">
            Impressum
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Contact; 