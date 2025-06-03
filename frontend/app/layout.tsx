import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "eCommerce Demo" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100 text-gray-900">
        <header className="bg-slate-900 text-white py-4">
          <div className="container mx-auto text-center font-semibold tracking-wide">
            e-SalesOne
          </div>
        </header>
        <main className="container mx-auto py-8">{children}</main>
      </body>
    </html>
  );
}


