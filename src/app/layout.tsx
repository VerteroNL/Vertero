import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vertero',
  description: 'Plug & play offerte quizzes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider signInFallbackRedirectUrl="/dashboard" signUpFallbackRedirectUrl="/dashboard">
      <html lang="nl">
        <head>
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-8STB5EY6KF"></script>
          <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-8STB5EY6KF');` }} />
        </head>
        <body>{children}<Analytics /></body>
      </html>
    </ClerkProvider>
  )
}