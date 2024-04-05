import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import Navbar from "./_components/Navbar";

const font = Sora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nutri Vista",
  description: "A new and modern way to keep track of your calories!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
