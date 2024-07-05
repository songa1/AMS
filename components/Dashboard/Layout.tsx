"use client";

import React from "react";
import Sidebar from "./Sidebar";
import { AccessDashboard } from "../Other/AccessDashboard";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex">
      <div className="h-full bg-mainBlue">
        <Sidebar />
      </div>

      <div className="p-5 w-full h-screen">
        <AccessDashboard>{children}</AccessDashboard>
      </div>
    </div>
  );
}

export default Layout;
