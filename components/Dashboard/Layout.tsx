"use client";

import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import React from "react";
import Sidebar from "./Sidebar";

function Layout({ children }: { children: React.ReactNode }) {
  const items = [
    {
      label: "New",
      icon: "pi pi-plus",
    },
    {
      label: "Search",
      icon: "pi pi-search",
    },
    {
      label: "Settings",
      icon: "pi pi-cog",
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
    },
  ];

  return (
    <div className="h-screen flex items-start">
      <div className="w-64 h-full">
        <Sidebar />
      </div>
      <div>{children}</div>
    </div>
  );
}

export default Layout;
