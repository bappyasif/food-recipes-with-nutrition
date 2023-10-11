import { Header } from '@/components/Header'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Footer } from '@/components/Footer'
import { ReduxStoreProvider } from '@/redux/provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "What's Cooking Yo",
  description: 'Discover, Lookup Recipes From Various Cuisines And Food Types',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className + ` flex flex-col justify-between min-h-[100vh] bg-accent text-primary-foreground`}>
        <ReduxStoreProvider>
          <Header />
          {children}
          <Footer />
        </ReduxStoreProvider>
      </body>
    </html>
  )
}
