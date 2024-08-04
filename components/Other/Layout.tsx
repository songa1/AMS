"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { AccessDashboard } from "./AccessDashboard";

function Layout({ children }: { children: React.ReactNode }) {
  const [titles, setTitles] = useState(true);
  return (
    <div className="h-screen flex">
      <div className="h-full bg-mainBlue">
        <Sidebar titles={titles} setTitles={setTitles} />
      </div>

      <div className={`p-5 w-full h-screen ${!titles ? "ml-16" : "ml-60"}`}>
        <AccessDashboard>{children}</AccessDashboard>
      </div>
    </div>
  );
}

export default Layout;
