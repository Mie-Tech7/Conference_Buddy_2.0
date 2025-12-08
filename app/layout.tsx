// app/layout.tsx
// Root Layout with PWA and Tailwind Setup

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/providers/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Conference Buddy',
    description: 'AI-powered conference networking platform',
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Conference Buddy',
    },
    formatDetection: {
        telephone: false,
    },
    openGraph: {
        type: 'website',
        siteName: 'Conference Buddy',
        title: 'Conference Buddy',
        description: 'AI-powered conference networking platform',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Conference Buddy',
        description: 'AI-powered conference networking platform',
    },
};

export const viewport: Viewport = {
    themeColor: '#7c3aed',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* PWA Meta Tags */}
                <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="mobile-web-app-capable" content="yes" />
            </head>
            <body className={inter.className}>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
}
