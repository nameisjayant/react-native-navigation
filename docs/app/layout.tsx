import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import { Navbar } from '@/components/Navbar';
import { themeScript } from '@/components/ThemeToggle';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: {
    default: 'React Native Navigation — native stacks & tabs',
    template: '%s · React Native Navigation',
  },
  description:
    'A small, type-safe navigation library for React Native, rendered by Jetpack Navigation 3 on Android.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      {/* Extensions such as Grammarly add attributes to <body> before hydration. */}
      <body suppressHydrationWarning>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
