import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const basePath = process.env.NODE_ENV === "production" ? "/open-marketingops" : "";

export const metadata: Metadata = {
  title: "Open MarketingOps - Understand Performance. Scale Smarter.",
  description: "Production-grade open-source marketing analytics, deterministic calculations, budget planning and campaign optimization platform.",
  icons: {
    icon: [
      { url: `${basePath}/icon.svg`, type: "image/svg+xml" },
      { url: `${basePath}/favicon.ico` },
      { url: `${basePath}/favicon.png`, type: "image/png" },
    ],
    shortcut: [`${basePath}/favicon.ico`, `${basePath}/icon.svg`],
    apple: [`${basePath}/icon.svg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" type="image/svg+xml" href={`${basePath}/icon.svg`} />
        <link rel="icon" type="image/png" href={`${basePath}/favicon.png`} />
        <link rel="shortcut icon" href={`${basePath}/favicon.ico`} />
        <link rel="apple-touch-icon" href={`${basePath}/icon.svg`} />
        <link rel="manifest" href={`${basePath}/manifest.json`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Unregister legacy Service Workers & purge legacy caches
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (var i = 0; i < registrations.length; i++) {
                    registrations[i].unregister();
                  }
                });
                if ('caches' in window) {
                  caches.keys().then(function(keys) {
                    keys.forEach(function(key) {
                      if (key.indexOf('andromeda-roas') !== -1) {
                        caches.delete(key);
                      }
                    });
                  });
                }
              }
            `,
          }}
        />
      </head>
      <body className="bg-[#F7F9FC] text-[#172033] antialiased min-h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
