import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GitVibe AI — Next-Gen GitHub Profile & Repo Roaster',
  description: 'AI-powered savage, witty, and technical GitHub roasts, developer archetype breakdown, holographic certificates, and global humiliation leaderboard.',
  keywords: ['GitHub Roast', 'AI Roaster', 'GitVibe AI', 'Developer Humor', 'Developer Archetypes', 'Code Review', 'Hacker News'],
  authors: [{ name: 'Pushkar Sharma', url: 'https://github.com/iprceations' }],
  metadataBase: new URL('https://gitvibeai.com'),
  openGraph: {
    title: 'GitVibe AI — Next-Gen GitHub Profile & Repo Roaster',
    description: 'AI-powered savage, witty, and technical GitHub roasts, developer archetype breakdown, and global humiliation leaderboard.',
    url: 'https://gitvibeai.com',
    siteName: 'GitVibe AI',
    images: [
      {
        url: '/logo-dark-transparent.png',
        width: 1200,
        height: 630,
        alt: 'GitVibe AI',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitVibe AI — Next-Gen GitHub Profile & Repo Roaster',
    description: 'AI-powered savage, witty, and technical GitHub roasts, developer archetype breakdown, and global humiliation leaderboard.',
    images: ['/logo-dark-transparent.png'],
    creator: '@iprceations',
  },
  icons: {
    icon: [
      { url: '/logo-dark-transparent.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/logo-dark-transparent.png',
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#09090b' },
    { media: '(prefers-color-scheme: dark)', color: '#050506' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var storedTheme = localStorage.getItem('theme');
                if (storedTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else if (storedTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased bg-slate-100 dark:bg-[#050508] text-slate-900 dark:text-zinc-100 transition-colors duration-300">
        {children}
      </body>
    </html>
  )
}
