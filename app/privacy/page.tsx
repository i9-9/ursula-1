'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';

export default function Privacy() {
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      <Navbar />
      
      <section className="pt-[calc(var(--navbar-height)+4rem)] pb-16 px-5 md:px-[30px]">
        <div className="max-w-2xl mx-auto">
          <h1 className="h2 mb-8 tracking-wide">Privacy Policy</h1>
          
          <div className="space-y-8">
            <div>
              <h2 className="h3 mb-3">Introduction</h2>
              <p className="text-p opacity-80 mb-2">
                This Privacy Policy explains how this portfolio website operates with respect to visitor privacy 
                and data protection.
              </p>
            </div>
            
            <div>
              <h2 className="h3 mb-3">Information We Collect</h2>
              <p className="text-p opacity-80 mb-2">
                <strong>No personal data collection:</strong> This website does not actively collect or store 
                personal information about visitors. We don&apos;t use analytics tools, tracking scripts, or cookies 
                that collect personal data.
              </p>
              <p className="text-p opacity-80 mb-2">
                <strong>Contact information:</strong> If you choose to contact us through the provided email 
                or phone number, any information you share is only used to respond to your inquiry.
              </p>
            </div>
            
            <div>
              <h2 className="h3 mb-3">Server Logs</h2>
              <p className="text-p opacity-80 mb-2">
                Like most websites, our hosting provider may automatically collect and store the following 
                information in server logs:
              </p>
              <ul className="list-disc pl-5 space-y-1 opacity-80">
                <li>IP address</li>
                <li>Browser type</li>
                <li>Pages visited</li>
                <li>Time and date of visit</li>
              </ul>
              <p className="text-p opacity-80 mt-2">
                This information is collected by our hosting service, not by us directly, and is automatically 
                deleted after a short period. It's used only for technical purposes like troubleshooting server issues.
              </p>
            </div>
            
            <div>
              <h2 className="h3 mb-3">Third-Party Links</h2>
              <p className="text-p opacity-80 mb-2">
                This website may include links to external sites (like social media profiles). We are not responsible 
                for the privacy practices of these other sites. We encourage you to read the privacy policies of any 
                external sites you visit through links on our site.
              </p>
            </div>
            
            <div>
              <h2 className="h3 mb-3">Changes to This Policy</h2>
              <p className="text-p opacity-80 mb-2">
                We may update this Privacy Policy occasionally. Any changes will be posted on this page.
              </p>
            </div>
            
            <div>
              <h2 className="h3 mb-3">Contact</h2>
              <p className="text-p opacity-80 mb-2">
                If you have questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:contact@ursulabenavides.com" className="underline hover:opacity-70 transition-opacity">
                  contact@ursulabenavides.com
                </a>.
              </p>
            </div>
            
            <div className="pt-8">
              <p className="text-p opacity-60 mb-2">Last updated: {new Date().toLocaleDateString()}</p>
              <Link 
                href="/" 
                className="inline-block mt-4 px-4 py-2 border border-foreground/20 hover:border-foreground/40 transition-colors rounded-sm"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 