'use client';
import { ReactNode } from 'react';
import { HeroUIProvider } from '@heroui/react';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
