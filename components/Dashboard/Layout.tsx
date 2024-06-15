"use client";

import React from "react";
import Sidebar from "./Sidebar";
import { AccessDashboard } from "../Other/AccessDashboard";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex items-start">
      <div className="fixed w-64 h-screen">
        <Sidebar />
      </div>
      <AccessDashboard>
        <div className="p-5 w-full ml-64 h-screen">{children}</div>
      </AccessDashboard>
    </div>
  );
}

export default Layout;
