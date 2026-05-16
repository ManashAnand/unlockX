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
  icons: { icon: '/image.png', apple: '/image.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/image.png" type="image/png" />
        <link rel="apple-touch-icon" href="/image.png" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'UnlockX', description: 'AI-powered side-by-side comparison of any two Twitter/X creators.', url: BASE_URL, applicationCategory: 'AnalyticsApplication', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } }) }} />
      </head>
      <body>
        {/* ── Subtle ambient glow ── */}
        <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {/* Indigo whisper — top-left */}
          <div style={{
            position: 'absolute', top: '-5%', left: '-5%',
            width: '55vw', height: '55vw', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(80,80,255,0.13) 0%, transparent 65%)',
            filter: 'blur(80px)',
            animation: 'orb-drift-a 20s ease-in-out infinite',
          }} />
          {/* Cyan whisper — bottom-right */}
          <div style={{
            position: 'absolute', bottom: '-5%', right: '-5%',
            width: '50vw', height: '50vw', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,180,255,0.11) 0%, transparent 65%)',
            filter: 'blur(90px)',
            animation: 'orb-drift-b 25s ease-in-out infinite',
          }} />
          {/* Violet accent — top-right */}
          <div style={{
            position: 'absolute', top: '5%', right: '5%',
            width: '30vw', height: '30vw', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(120,60,255,0.09) 0%, transparent 65%)',
            filter: 'blur(70px)',
          }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  )
}
