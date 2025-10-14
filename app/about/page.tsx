import Link from 'next/link';
import Copyright from '../components/Copyright';

export default function AboutPage() {
  return (
    <div className="relative h-screen flex flex-col">
      <main className="flex-1 px-4 md:px-[30px] pt-20 md:pt-10" style={{ height: 'calc(100vh - 36px)' }}>
        <div className="flex flex-col gap-y-1 text-[10px] md:text-[12px]">
          <span>PRODUCTION DESIGNER, ART DIRECTOR, SET DESIGNER</span>
          <span>FROM BUENOS AIRES, ARGENTINA</span>
          <span className="flex flex-row pt-24">CONTACT: 
            <span className="flex flex-row ml-2">
              <Link href="mailto:ursulabenavidez19@gmail.com" className="hover:opacity-70 transition-opacity">
                MAIL,
              </Link>
              <Link href="https://instagram.com/ursulabenavidez" target="_blank" rel="noopener noreferrer" className="ml-2 hover:opacity-70 transition-opacity">
                INSTAGRAM,
              </Link>
              <Link href="https://vimeo.com/ursulabenavidez" target="_blank" rel="noopener noreferrer" className="ml-2 hover:opacity-70 transition-opacity">
                VIMEO
              </Link>
            </span>
          </span>
        </div>
      </main>
      <div className="absolute bottom-24 right-0 px-4 md:px-[30px]">
        <Copyright absolute={true} />
      </div>
    </div>
  );
}


