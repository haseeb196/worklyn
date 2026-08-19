import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Worklyn", template: "%s" },
  description:
    "Worklyn — client and project management for freelancers and small agencies.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2c2abc",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        {children}
        <ThemeToggle />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
