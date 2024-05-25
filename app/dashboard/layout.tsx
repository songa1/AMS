import Layout from "@/components/Dashboard/Layout";
import React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <title>AMS Dashboard</title>
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
