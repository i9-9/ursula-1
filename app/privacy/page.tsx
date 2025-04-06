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
                This Privacy Policy explains how Ursula Benavidez (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) collects, uses, and discloses 
                information about visitors to our website.
              </p>
            </div>
            
            <div>
              <h2 className="h3 mb-3">Information We Collect</h2>
              <p className="text-p opacity-80 mb-2">
                <strong>Information you provide:</strong> When you contact us, we collect the information you provide, 
                such as your name, email address, and any message content.
              </p>
              <p className="text-p opacity-80 mb-2">
                <strong>Automatic information:</strong> We automatically collect certain information when you visit our site, 
                including your IP address, browser type, referring/exit pages, operating system, date/time stamps, and clickstream data.
              </p>
            </div>
            
            <div>
              <h2 className="h3 mb-3">How We Use Information</h2>
              <p className="text-p opacity-80 mb-2">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-5 space-y-1 opacity-80">
                <li>Respond to your inquiries and communicate with you</li>
                <li>Provide, maintain, and improve our website</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, prevent, and address technical issues</li>
              </ul>
            </div>
            
            <div>
              <h2 className="h3 mb-3">Cookies and Similar Technologies</h2>
              <p className="text-p opacity-80 mb-2">
                We may use cookies and similar technologies to collect information about your browsing activities and 
                to improve your experience on our site. You can control cookies through your browser settings.
              </p>
            </div>
            
            <div>
              <h2 className="h3 mb-3">Data Retention</h2>
              <p className="text-p opacity-80 mb-2">
                We retain your information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
                unless a longer retention period is required or permitted by law.
              </p>
            </div>
            
            <div>
              <h2 className="h3 mb-3">Your Rights</h2>
              <p className="text-p opacity-80 mb-2">
                Depending on your location, you may have certain rights regarding your personal information, 
                including the right to access, correct, delete, restrict, or object to our processing of your data.
              </p>
            </div>
            
            <div>
              <h2 className="h3 mb-3">Changes to This Privacy Policy</h2>
              <p className="text-p opacity-80 mb-2">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page.
              </p>
            </div>
            
            <div>
              <h2 className="h3 mb-3">Contact Us</h2>
              <p className="text-p opacity-80 mb-2">
                If you have any questions about this Privacy Policy, please contact us at{' '}
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