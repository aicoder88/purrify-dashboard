import type { Metadata, Viewport } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';
import { ConnectionStatus } from '@/components/ui/enhanced-loading';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { ReactQueryProvider } from '@/lib/react-query';
import PWAProvider from '../components/pwa/pwa-provider';
import { TempoInit } from './tempo-init';
// import { initPerformanceMonitoring, reportWebVitals } from "@/lib/performance";
// import { initCacheCleanup } from "@/lib/cache";
// import { analytics } from "@/lib/analytics";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#00D4FF',
  colorScheme: 'light',
};

export const metadata: Metadata = {
  title: 'Purrify Sales Dashboard',
  description:
    'Modern sales analytics dashboard for Purrify.ca - Real-time insights, beautiful visualizations, and comprehensive business metrics.',
  keywords: [
    'sales',
    'dashboard',
    'analytics',
    'purrify',
    'business intelligence',
    'PWA',
  ],
  authors: [{ name: 'Purrify Team' }],
  creator: 'Purrify.ca',
  publisher: 'Purrify.ca',
  robots: {
    index: false, // Private dashboard
    follow: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Purrify Dashboard',
    startupImage: [
      {
        url: '/apple-splash-2048-2732.png',
        media:
          '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/apple-splash-1668-2224.png',
        media:
          '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/apple-splash-1536-2048.png',
        media:
          '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/apple-splash-1125-2436.png',
        media:
          '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/apple-splash-1242-2208.png',
        media:
          '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        url: '/apple-splash-750-1334.png',
        media:
          '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/apple-splash-640-1136.png',
        media:
          '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dashboard.purrify.ca',
    title: 'Purrify Sales Dashboard',
    description: 'Modern sales analytics dashboard for Purrify.ca',
    siteName: 'Purrify Dashboard',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Purrify Sales Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Purrify Sales Dashboard',
    description: 'Modern sales analytics dashboard for Purrify.ca',
    images: ['/og-image.png'],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'msapplication-TileColor': '#1ABC9C',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        {/* PWA Meta Tags */}
        <meta name="application-name" content="Purrify Dashboard" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Purrify Dashboard" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#00D4FF" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/manifest.json"
          as="fetch"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Performance and Analytics Initialization */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize performance monitoring
              if (typeof window !== 'undefined') {
                // Web Vitals reporting
                function reportWebVitals(metric) {
                  if (window.gtag) {
                    window.gtag('event', metric.name, {
                      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                      event_category: 'Web Vitals',
                      event_label: metric.id,
                      non_interaction: true,
                    });
                  }
                  console.log('Web Vital:', metric);
                }
                
                // Initialize analytics
                window.addEventListener('load', function() {
                  // Initialize performance monitoring
                  if (window.initPerformanceMonitoring) {
                    window.initPerformanceMonitoring();
                  }
                  
                  // Initialize cache cleanup
                  if (window.initCacheCleanup) {
                    window.initCacheCleanup();
                  }
                  
                  // Initialize analytics
                  if (window.analytics) {
                    window.analytics.initialize({
                      enableInDevelopment: false,
                    });
                  }
                });
              }
            `,
          }}
        />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js', { scope: '/' })
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
        <!-- <script src="https://api.tempo.build/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" /> [deprecated] -->
      </head>
      <body className={`${inter.className} antialiased`}>
        <ConnectionStatus />
        <EnhancedErrorBoundary level="critical">
          <ThemeProvider>
            <ReactQueryProvider>
              <div id="root">
                <TempoInit />
                {children}
              </div>
              <div id="modal-root" />
              <div id="toast-root" />
              <div id="portal-root" />
              <PWAProvider />
            </ReactQueryProvider>
          </ThemeProvider>
        </EnhancedErrorBoundary>
      </body>
    </html>
  );
}
