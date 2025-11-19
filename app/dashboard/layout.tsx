import Layout from "@/components/Other/Layout";
import React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Layout>{children}</Layout>
    </div>
  );
}
