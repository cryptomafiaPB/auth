/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LoggerToggle from "@/components/LoggerToggle";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Auth Playground',
  description: 'Interactive auth tutorial for Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark:bg-gray-900">
      <body className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <Providers>
          <header className="flex items-center justify-between p-4 shadow">
            <h1 className="text-xl font-bold">
              <Link href="/">Auth Playground</Link>
            </h1>
            <nav className="space-x-4">
              <Link href="/auth/signup" className="hover:underline">Sign Up</Link>
              <Link href="/auth/login" className="hover:underline">Login</Link>
            </nav>
            <div className="flex space-x-2">
              <ThemeToggle />
              <LoggerToggle />
            </div>
          </header>

          <main className="p-6">{children}</main>
          <footer className="p-4 text-center text-sm">
            &copy; {new Date().getFullYear()} Auth Playground
          </footer>
        </Providers>
      </body>
    </html>
  );
}
