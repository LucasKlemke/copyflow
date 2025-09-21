"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";

import { ExpandableSidebar } from "@/components/expandable-sidebar";
import { Header } from "@/components/header";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Routes that don't need the sidebar and header
  const authRoutes = ["/auth/login", "/auth/signup", "/onboarding", "/landing"];
  const isAuthRoute = authRoutes.includes(pathname);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen">
          {isAuthRoute ? (
            <main>{children}</main>
          ) : (
            <>
              <ExpandableSidebar />
              <div className="pl-16">
                {/* Add padding to account for collapsed sidebar */}
                <Header />
                <main>{children}</main>
              </div>
            </>
          )}
        </div>
      </body>
    </html>
  );
}
