"use client"

import {ReactNode} from 'react';
import {SessionProvider} from "next-auth/react"
import './globals.css';

type Props = {
  children: ReactNode;
};

// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({children}: Props) {
  // return children;

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}