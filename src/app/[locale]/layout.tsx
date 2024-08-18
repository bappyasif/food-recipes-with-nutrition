import { Header } from '@/components/Header'
import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { ReduxStoreProvider } from '@/redux/provider'
import { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"
// import favIcon from "../../../public/preview.png"
// import { getAllViewedRecipesFromDb } from '@/redux/thunks'
// import store from '@/redux/store'

// calling this from layout is not actually updating redux state, as it gets re written after page load
// thats why using this from a component which shows up after page loads and then dispatching it from there to update store
// here i did this from Header component
// store.dispatch(getAllViewedRecipesFromDb())

export const metadata: Metadata = {
  title: "What's Cooking Yo",
  description: 'Discover, Lookup Recipes From Various Cuisines And Food Types',
  openGraph: {
    images: ["https://source.unsplash.com/random/200?food"]
  }
}

type Props = {
  children: ReactNode;
  params: { locale: string };
};

async function getMessages(locale: string) {
  try {
    // with react-intl library for locale management in i18nexus
    // return (await import(`../../../messages/${locale}/default.json`)).default;

    // this with next-intl library from i18nexus
    return (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export async function generateStaticParams() {
  return ['en', 'bn'].map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: Props) {
  const messages = await getMessages(locale);
  return (
    <html lang="en">
      <body
        className={`flex flex-col justify-between min-h-[100vh] bg-background text-primary-foreground`}
      >
        <ReduxStoreProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Header />
            {children}
            {/* <Analytics /> */}
            <SpeedInsights />
            <Footer />
          </NextIntlClientProvider>
        </ReduxStoreProvider>
      </body>
    </html>
  )
}
