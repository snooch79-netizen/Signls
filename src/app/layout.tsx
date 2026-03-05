import type { Metadata } from 'next';

import './globals.css';

 

export const metadata: Metadata = {

  title: 'Signls',

  description: 'A gentle daily wellness check-in',

};

 

export default function RootLayout({

  children,

}: {

  children: React.ReactNode;

}) {

  return (

    <html lang="en">

      <body>{children}</body>

    </html>

  );

}