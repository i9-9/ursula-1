'use client';

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="py-4 md:py-6 px-5 md:px-[30px]">
      <div className="grid grid-cols-12 items-center">
        <p className="text-xs md:text-sm col-span-6 md:col-span-6 opacity-60">© {new Date().getFullYear()}</p>
        <Link 
          href="/privacy" 
          className="text-xs md:text-sm hover:opacity-100 transition-opacity col-span-6 md:col-start-7 md:col-span-6 opacity-60"
        >
          Privacy
        </Link>
      </div>
    </footer>
  );
};

export default Footer; 