'use client';

import Link from 'next/link';

const Contact = () => {
  return (
    <section id="contact" className="py-20 px-[30px]">
      <h2 className="text-2xl mb-12 tracking-wide">CONTACT</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
        <div>
          <h3 className="text-lg mb-4">GET IN TOUCH</h3>
          <ul className="space-y-4">
            <li>
              <p className="text-sm opacity-70 mb-1">Email</p>
              <a 
                href="mailto:contact@ursulabenavides.com" 
                className="text-foreground hover:opacity-70 transition-opacity"
              >
                contact@ursulabenavides.com
              </a>
            </li>
            <li>
              <p className="text-sm opacity-70 mb-1">Phone</p>
              <a 
                href="tel:+341234567890" 
                className="text-foreground hover:opacity-70 transition-opacity"
              >
                +34 123 456 7890
              </a>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg mb-4">FOLLOW</h3>
          <ul className="space-y-4">
            <li>
              <a 
                href="https://instagram.com/ursulabenavidez" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:opacity-70 transition-opacity"
              >
                Instagram
              </a>
            </li>
            <li>
              <a 
                href="https://linkedin.com/in/ursulabenavidez" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:opacity-70 transition-opacity"
              >
                LinkedIn
              </a>
            </li>
          </ul>
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