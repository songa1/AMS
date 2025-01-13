"use client";

import * as React from "react";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import SidebarFooterAccount, { ToolbarAccountOverride } from "./SidebarFooter";
import { AppProvider } from "@toolpad/core";
import Copyright from "./Copyright";
import { Navigation } from "@toolpad/core";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import FoundationIcon from "@mui/icons-material/Foundation";
import EditIcon from "@mui/icons-material/Edit";
import { Chip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SettingsIcon from "@mui/icons-material/Settings";
import { AccessDashboard } from "./AccessDashboard";
import { useCommsQuery } from "@/lib/features/statsSlice";
import { getUser } from "@/helpers/auth";

function Layout(props: any) {
  const user = getUser();
  const { data: Stats } = useCommsQuery(user?.id);
  const isAdmin = user?.role?.name == "ADMIN";

  const NAVIGATION: Navigation = [
    ...(isAdmin
      ? [
          {
            segment: "dashboard",
            title: "Dashboard",
            icon: <DashboardIcon />,
          },
        ]
      : []),
    {
      kind: "header",
      title: "Your Profile",
    },
    {
      segment: "dashboard/profile",
      title: "View Profile",
      icon: <AccountBoxIcon />,
    },
    ...(isAdmin
      ? [
          {
            segment: "dashboard/update-profile",
            title: "Edit Profile",
            icon: <EditIcon />,
            children: [
              {
                segment: "/",
                title: "Personal Info",
                icon: <SettingsAccessibilityIcon />,
              },
              {
                segment: "/organization-founded",
                title: "Organization Founded",
                icon: <FoundationIcon />,
              },
              {
                segment: "/organization-employed",
                title: "Employment Info",
                icon: <CorporateFareIcon />,
              },
            ],
          },
        ]
      : []),
    {
      kind: "divider",
    },
    {
      kind: "header",
      title: "Communication",
    },
    {
      segment: "dashboard/notifications",
      title: "Notifications",
      icon: <NotificationsIcon />,
      action: Number(Stats?.data?.notifications) > 0 && (
        <Chip
          label={Stats?.data?.notifications ? Stats?.data?.notifications : ""}
          color="info"
          size="small"
        />
      ),
    },
    {
      segment: "dashboard/chat",
      title: "Chat",
      icon: <ChatIcon />,
      action: Number(Stats?.data?.messages) > 0 && (
        <Chip
          label={Stats?.data?.messages ? Stats?.data?.messages : ""}
          color="info"
          size="small"
        />
      ),
    },
    {
      kind: "divider",
    },
    {
      kind: "header",
      title: "Members",
    },
    {
      segment: "dashboard/users",
      title: "Members",
      icon: <PeopleIcon />,
    },
    ...(isAdmin
      ? [
          {
            segment: "dashboard/add-new-user",
            title: "Add New User",
            icon: <PersonAddIcon />,
          },
        ]
      : []),
    {
      kind: "divider",
    },
    {
      kind: "header",
      title: "Security",
    },
    {
      segment: "dashboard/change-password",
      title: "Change Password",
      icon: <EnhancedEncryptionIcon />,
    },
    ...(isAdmin
      ? [
          {
            segment: "dashboard/settings",
            title: "Settings",
            icon: <SettingsIcon />,
          },
        ]
      : []),
    {
      segment: "dashboard/logout",
      title: "Logout",
      icon: <LogoutIcon />,
    },
  ];
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
          <AccessDashboard>{props.children}</AccessDashboard>
          <Copyright sx={{ my: 4 }} />
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}

export default Layout;
