import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import AuthProvider from "@/helpers/provider";

export const metadata: Metadata = {
  title: "YALI Alumni Management System",
  description: "One place to manage all alumni data and interactions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <AuthProvider>
          <StoreProvider>{children}</StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
