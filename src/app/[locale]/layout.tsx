import { Header } from '@/components/Header'
import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { ReduxStoreProvider } from '@/redux/provider'
import { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import {createTranslator, NextIntlClientProvider} from 'next-intl';

export const metadata: Metadata = {
  title: "What's Cooking Yo",
  description: 'Discover, Lookup Recipes From Various Cuisines And Food Types',
}

type Props = {
  children: ReactNode;
  params: {locale: string};
};

async function getMessages(locale: string) {
  try {
    return (await import(`../../../messages/${locale}/default.json`)).default;
  } catch (error) {
    notFound();
  }
}

export async function generateStaticParams() {
  return ['en', 'bn'].map((locale) => ({locale}));
}

// export async function generateMetadata({params: {locale}}: Props) {
//   const messages = await getMessages(locale);

//   // You can use the core (non-React) APIs when you have to use next-intl
//   // outside of components. Potentially this will be simplified in the future
//   // (see https://next-intl-docs.vercel.app/docs/next-13/server-components).
//   const t = createTranslator({locale, messages});

//   return {
//     title: t('LocaleLayout.title')
//   };
// }

export default async function LocaleLayout({
  children,
  params: {locale}
}: Props) {
  const messages = await getMessages(locale);
  return (
    <html lang="en">
      <body 
        // className={inter.className + ` flex flex-col justify-between min-h-[100vh] bg-accent text-primary-foreground`}
        className={`flex flex-col justify-between min-h-[100vh] bg-accent text-primary-foreground`}
      >
        <ReduxStoreProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
        <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
        </ReduxStoreProvider>
      </body>
    </html>
  )
}
