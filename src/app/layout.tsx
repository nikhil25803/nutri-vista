import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import AuthProvider from "./_components/SessionProvider";
import { Toaster } from "react-hot-toast";

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
        <AuthProvider>
          <Navbar />
          <Toaster position="top-right" />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
