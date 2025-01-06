"use client";

// import React, { useState } from "react";
// import Sidebar from "./Sidebar";
// import { AccessDashboard } from "./AccessDashboard";

// function Layout({ children }: { children: React.ReactNode }) {
//   const [titles, setTitles] = useState(true);
//   return (
//     <div className="h-screen flex">
//       <div className="h-full bg-mainBlue">
//         <Sidebar titles={titles} setTitles={setTitles} />
//       </div>

//       <div className={`p-5 w-full h-screen ${!titles ? "ml-14" : "ml-60"}`}>
//         <AccessDashboard>{children}</AccessDashboard>
//       </div>
//     </div>
//   );
// }

import * as React from "react";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import SidebarFooterAccount, { ToolbarAccountOverride } from "./SidebarFooter";
import { NAVIGATION } from "./Sidebar";
import { AppProvider, Router } from "@toolpad/core";
import { extendTheme } from "@mui/material";
import Copyright from "./Copyright";

function Layout(props: any) {
  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        logo: <img src="/yali.png" alt="YALI AMS logo" />,
        title: "",
        homeUrl: "/dashboard",
      }}
    >
      <DashboardLayout
        slots={{
          toolbarAccount: ToolbarAccountOverride,
          sidebarFooter: SidebarFooterAccount,
        }}
      >
        <PageContainer>
          {props.children}
          <Copyright sx={{ my: 4 }} />
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}

export default Layout;
