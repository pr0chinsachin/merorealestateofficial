import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./footer/footer";
import Header from "./header/header";
import ContactToggle from "./contactToggle/page";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mero Real Estate ",
  description: "A complete real estate solution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
          <Header />
          <Suspense>{children}</Suspense>
          <ContactToggle />
          <Footer />
        </div>
      </body>
    </html>
  );
}
