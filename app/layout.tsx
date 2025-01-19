import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import AuthProvider from "@/helpers/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alumni Management System",
  description: "Alumni management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <StoreProvider>
          <body className={inter.className}>{children}</body>
        </StoreProvider>
      </AuthProvider>
    </html>
  );
}
