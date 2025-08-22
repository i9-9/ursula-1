import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="px-2.5 md:px-[15px]">
      <div className="pt-8 flex flex-col gap-y-1 text-[10px]">
        <p>PRODUCTION DESIGNER, ART DIRECTOR, SET DESIGNER</p>
        <p>FROM BUENOS AIRES, ARGENTINA</p>
        <p className="flex flex-row pt-24">CONTACT: 
          <span className="flex flex-row ml-2">
            <Link href="mailto:info@ursulabenavidez.com" className="hover:opacity-70 transition-opacity">
              MAIL,
            </Link>
            <Link href="https://instagram.com/ursulabenavidez" target="_blank" rel="noopener noreferrer" className="ml-2 hover:opacity-70 transition-opacity">
              INSTAGRAM
            </Link>
          </span>
        </p>
      </div>
    </main>
  );
}


