'use client';

import Image from 'next/image';
import { useScrollReveal } from '@/app/hooks/useScrollReveal';

const Contact = () => {
  useScrollReveal();
  
  return (
    <>
      <section id="contact" className="py-6 md:py-8 px-2.5 md:px-[15px] relative" style={{ zIndex: 1 }}>
        <div className="mb-4">
          <h2 className="h2 section-title section-title-delay-2 font-suisse-bp-intl text-xs md:text-sm">CONTACT</h2>
        </div>
        
        <div className="space-y-6 md:space-y-4">
          <div className="archive-section">
            {/* Header for mobile */}
            <div className="md:hidden mb-3 text-xs opacity-60">
              <div>CONTACT DETAILS</div>
            </div>
            
            <div className="space-y-0">
              <div 
                  className="group hover:bg-black/5 transition-colors duration-200 -mx-2 px-2 py-1 mb-0.25 relative"
                >
                {/* Desktop layout */}
                <div className="hidden md:grid md:grid-cols-12 items-start">
                  <div className="col-span-6 pr-4 whitespace-nowrap overflow-visible text-p">Location</div>
                  <div className="col-start-7 col-span-6 text-left whitespace-nowrap overflow-visible text-p">
                    Buenos Aires, Argentina
                  </div>
                </div>
                
                {/* Mobile layout */}
                <div className="md:hidden">
                  <div className="flex flex-col">
                    <div className="font-medium text-p mb-1">Location</div>
                    <div className="text-sm">
                      Buenos Aires, Argentina
                    </div>
                  </div>
                </div>
              </div>
              
              <div 
                  className="group hover:bg-black/5 transition-colors duration-200 -mx-2 px-2 py-1 mb-0.25 relative"
                >
                {/* Desktop layout */}
                <div className="hidden md:grid md:grid-cols-12 items-start">
                  <div className="col-span-6 pr-4 whitespace-nowrap overflow-visible text-p">Email</div>
                  <div className="col-start-7 col-span-6 text-left whitespace-nowrap overflow-visible text-p">
                    <a 
                      href="mailto:info@ursulabenavidez.com" 
                      className="text-foreground hover:opacity-70 transition-opacity"
                    >
                      info@ursulabenavidez.com
                    </a>
                  </div>
                </div>
                
                {/* Mobile layout */}
                <div className="md:hidden">
                  <div className="flex flex-col">
                    <div className="font-medium text-p mb-1">Email</div>
                    <div className="text-sm">
                      <a 
                        href="mailto:info@ursulabenavidez.com" 
                        className="text-foreground hover:opacity-70 transition-opacity"
                      >
                        info@ursulabenavidez.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                  className="group hover:bg-black/5 transition-colors duration-200 -mx-2 px-2 py-1 mb-0.25 relative"
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
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="absolute bottom-0 right-0 w-24 h-24 md:w-38 md:h-38 pr-2.5 md:pr-[15px] pb-6 md:pb-8">
          <div className="relative w-full h-full">
            <Image
              src="/images/logo/logo.svg"
              alt="Ursula Benavidez Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact; 