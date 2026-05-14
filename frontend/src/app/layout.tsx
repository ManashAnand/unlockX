import type { Metadata } from 'next'
import '../styles/tokens.css'
import './globals.css'

const BASE_URL = 'https://unlockx.ai'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: 'UnlockX — Twitter Creator Intelligence', template: '%s | UnlockX' },
  description: 'AI-powered side-by-side comparison of any two Twitter/X creators. See who grows faster, why, and what to learn — in seconds.',
  keywords: ['twitter analytics', 'creator comparison', 'twitter growth', 'x analytics', 'social media intelligence', 'creator analytics', 'twitter creator tool', 'ai twitter analysis'],
  authors: [{ name: 'UnlockX' }],
  creator: 'UnlockX',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  openGraph: {
    type: 'website', locale: 'en_US', url: BASE_URL, siteName: 'UnlockX',
    title: 'UnlockX — Twitter Creator Intelligence',
    description: 'AI-powered side-by-side comparison of any two Twitter/X creators.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'UnlockX' }],
  },
  twitter: { card: 'summary_large_image', title: 'UnlockX — Twitter Creator Intelligence', description: 'Who grows faster on Twitter? Find out in seconds.', images: ['/og-image.png'], creator: '@unlockx_ai' },
  alternates: { canonical: BASE_URL },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'UnlockX', description: 'AI-powered side-by-side comparison of any two Twitter/X creators.', url: BASE_URL, applicationCategory: 'AnalyticsApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }) }} />
      </head>
      <body>
        {/* ── Ambient background ── */}
        <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {/* Big indigo bloom — top-left, partly off-screen */}
          <div style={{
            position: 'absolute', top: '-20%', left: '-15%',
            width: '75vw', height: '75vw', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,124,255,0.38) 0%, rgba(100,80,255,0.18) 35%, transparent 65%)',
            filter: 'blur(50px)',
          }} />
          {/* Big coral bloom — bottom-right, partly off-screen */}
          <div style={{
            position: 'absolute', bottom: '-20%', right: '-15%',
            width: '70vw', height: '70vw', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,100,60,0.35) 0%, rgba(255,80,40,0.15) 35%, transparent 65%)',
            filter: 'blur(55px)',
          }} />
          {/* Secondary indigo accent — top-right */}
          <div style={{
            position: 'absolute', top: '5%', right: '-5%',
            width: '35vw', height: '35vw', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(140,100,255,0.22) 0%, transparent 65%)',
            filter: 'blur(40px)',
          }} />
          {/* Secondary coral accent — bottom-left */}
          <div style={{
            position: 'absolute', bottom: '10%', left: '-5%',
            width: '30vw', height: '30vw', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,120,60,0.18) 0%, transparent 65%)',
            filter: 'blur(45px)',
          }} />
          {/* Center subtle indigo haze */}
          <div style={{
            position: 'absolute', top: '40%', left: '30%',
            width: '40vw', height: '25vw', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(100,100,255,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  )
}
