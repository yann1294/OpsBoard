import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpsBoard",
  description: "OpsBoard frontend shell",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900">
        <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col">
          <header className="border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold tracking-tight">OpsBoard</p>
              <p className="text-sm text-slate-500">MVP DevOps Dashboard</p>
            </div>
          </header>
          <main className="flex-1 px-6 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
