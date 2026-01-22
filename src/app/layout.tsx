import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

const siteUrl = 'https://enditforme.com';

export const metadata: Metadata = {
  title: 'EndItForMe | It’s Not You, It’s AI.',
  description: 'Too scared to dump them? We do the dirty work for $1. Generate Toxic or HR-Approved breakup texts instantly.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'EndItForMe | It’s Not You, It’s AI.',
    description: 'Too scared to dump them? We do the dirty work for $1. Generate Toxic or HR-Approved breakup texts instantly.',
    url: siteUrl,
    siteName: 'EndItForMe',
    images: [
      {
        url: '/social-preview.png', // Relative to metadataBase
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EndItForMe | It’s Not You, It’s AI.',
    description: 'Too scared to dump them? We do the dirty work for $1. Generate Toxic or HR-Approved breakup texts instantly.',
    images: [`${siteUrl}/social-preview.png`],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💔</text></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,8..144,400;0,8..144,700;1,8..144,400&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
