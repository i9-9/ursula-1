import localFont from 'next/font/local';

export const neueMontrealMono = localFont({
  src: [
    {
      path: '../public/fonts/PPNeueMontrealMono-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/fonts/PPNeueMontrealMono-Book.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/PPNeueMontrealMono-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/PPNeueMontrealMono-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/PPNeueMontrealMono-RegularItalic.otf',
      weight: 'normal',
      style: 'italic',
    },
    {
      path: '../public/fonts/PPNeueMontrealMono-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-neue-montreal',
  display: 'swap',
}); 