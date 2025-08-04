import '@/styles/globals.css';
import { Metadata, Viewport } from 'next';
import { Link } from '@heroui/link';
import clsx from 'clsx';

import { Providers } from './providers';

import { siteConfig } from '@/config/site';
import { fontSans } from '@/config/fonts';
import Navbar from '@/components/Navbar';
import { Montserrat } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const montserrat = Montserrat({
  weight: '400',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico'
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang='en'>
      <head />
      <body
        className={clsx(
          `text-foreground font-sans antialiased ${montserrat.className}`,
          fontSans.variable
        )}>
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <div className='flex flex-col bg-cover bg-[url(/tennis_court.jpg)]'>
            <main>
              <Navbar />
              <Toaster position='top-center' reverseOrder={false} />;{children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
