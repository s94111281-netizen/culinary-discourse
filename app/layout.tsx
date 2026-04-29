import type { Metadata } from "next";
import { TopNav } from "@/components/TopNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Culinary Discourse: A Discourse-Driven Hong Kong Food Map",
  description:
    "A research-driven interactive map visualizing how Hong Kong food is described across local discourse, tourist, social media, and prestige-cultural discourse."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <TopNav />
        {children}
      </body>
    </html>
  );
}

