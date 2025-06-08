import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";

// Cart & Layout Components
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/cart/CartSidebar";
import { Toaster } from "@/components/ui/toaster";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { useEffect } from 'react';

// Load Cinzel font for headings
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
  weight: ['400', '500', '600', '700'],
  style: ['normal'],
  adjustFontFallback: true,
});


export const metadata: Metadata = {
  title: "LivAuthentik | Premium Wellness & Performance",
  description: "Elevate your wellness journey with Devotion - our premium protein and colostrum supplement, and the Devotion Experience - your all-in-one mind, fitness, and nutrition program.",
  keywords: ["protein supplement", "colostrum", "wellness", "fitness", "nutrition", "meal plans", "mindfulness"],
  authors: [{ name: "LivAuthentik" }],
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffff0" },
    { media: "(prefers-color-scheme: dark)", color: "#3d2e25" },
  ],
  openGraph: {
    title: "LivAuthentik | Premium Wellness & Performance",
    description: "Elevate your wellness journey with our premium supplements and programs.",
    url: "https://livauthentik.com",
    siteName: "LivAuthentik",
    locale: "en_US",
    type: "website",
  },
};

// Add loading state type
type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${cinzel.variable} font-sans`}>
      <body className="min-h-screen bg-background antialiased relative">
        <CartProvider>
          <SmoothScrollProvider>
            <Header />
            <main className="min-h-[calc(100vh-4rem)]">
              {children}
            </main>
            <Footer />
            <CartSidebar />
            <Toaster />
          </SmoothScrollProvider>
        </CartProvider>
      </body>
    </html>
  );
}
