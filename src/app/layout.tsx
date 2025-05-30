import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

// Cart & Layout Components
import { CartProvider } from "@/contexts/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/cart/CartSidebar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: false,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  adjustFontFallback: false,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <CartProvider>
          <Header />
          <main className="pt-16">{children}</main>
          <Footer />
          <CartSidebar />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
