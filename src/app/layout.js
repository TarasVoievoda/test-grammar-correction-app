import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { TanstackProvider } from "@/providers";

import { AuthContextProvider } from "@/context";

import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Grammar correction app",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <TanstackProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
        >
          <AuthContextProvider>
            <Toaster />
            <div className="bg-gray-100 min-h-dvh">{children}</div>
          </AuthContextProvider>
        </body>
      </html>
    </TanstackProvider>
  );
}
