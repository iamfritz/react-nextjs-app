import type { Metadata } from "next";
import SiteLayout from "@/components/SiteLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Laravel AI",
  description:
    "A Laravel API and Next.js frontend starter site with Home, About, and Blog pages.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
