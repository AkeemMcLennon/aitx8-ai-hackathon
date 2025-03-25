import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/toaster";
import { PosterContextProvider } from "@/components/PosterContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Event Graphics Generator",
  description: "Create beautiful event posters in minutes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} antialiased`}>
        <PosterContextProvider>
          {children}
          <Toaster />
        </PosterContextProvider>
      </body>
    </html>
  );
}
